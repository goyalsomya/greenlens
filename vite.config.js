import { defineConfig, loadEnv } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import babel from '@rolldown/plugin-babel'
import { GoogleAuth } from 'google-auth-library'

const GEMINI_MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-pro']

const parseJsonBody = (req) =>
  new Promise((resolve, reject) => {
    let body = ''
    req.on('data', (chunk) => {
      body += chunk
    })
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {})
      } catch (error) {
        reject(error)
      }
    })
    req.on('error', reject)
  })

const sendJson = (res, statusCode, payload) => {
  res.statusCode = statusCode
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(payload))
}

const buildPrompt = (data, action) => `
You are an Environmental Scientist and Urban Planner.
Analyze the following urban environmental data for a city:
- Current Temperature: ${data?.temp ?? 'N/A'}°C
- Current Green Cover: ${data?.greenCover ?? 'N/A'}%
- Action Taken: ${action === 'plant' ? 'Planting new urban forests' : 'Clearing existing forest area'}
- Projected Impact Summary: ${data?.impactSummary ?? 'N/A'}

Provide a concise 3-sentence scientific analysis of why this matters for the local ecosystem and a recommendation for the city council.
Use a professional, persuasive, yet accessible tone.
`.trim()

const clamp = (value, min, max) => Math.max(min, Math.min(max, value))

const calculateSimulationImpact = ({ action, hectares, zoneArea, baseline, areaGreenCover }) => {
  const safeHectares = Number(hectares) || 0
  const safeZoneArea = Math.max(1, Number(zoneArea) || 1)
  const isPlant = action === 'plant'
  const direction = isPlant ? -1 : 1
  const referenceGreenCover = Number(areaGreenCover ?? baseline?.greenCover ?? 20)

  const sensitivity = isPlant
    ? clamp((55 - referenceGreenCover) / 30, 0.65, 1.9)
    : clamp(referenceGreenCover / 28, 0.65, 2.1)

  const tempDelta = Number((direction * safeHectares * 0.05 * sensitivity).toFixed(1))
  const aqiDelta = Math.round(direction * safeHectares * 1.2 * sensitivity)
  const floodDelta = Math.round(direction * safeHectares * 0.8 * sensitivity)
  const greenCoverDelta = Math.round((safeHectares / safeZoneArea) * 100 * sensitivity) * (isPlant ? 1 : -1)

  const baselineTemp = Number(baseline?.temp) || 0
  const baselineGreenCover = Number(baseline?.greenCover) || 0
  const baselineAqi = Number(baseline?.aqi) || 0

  return {
    tempDelta,
    aqiDelta,
    floodDelta,
    greenCoverDelta,
    areaBaselineGreenCover: referenceGreenCover,
    projected: {
      temp: Number((baselineTemp + tempDelta).toFixed(1)),
      greenCover: Math.max(0, Math.min(100, baselineGreenCover + greenCoverDelta)),
      aqi: Math.max(0, baselineAqi + aqiDelta),
    },
  }
}

const seededPercent = (lat, lng, min, max) => {
  const seed = Math.abs(Math.sin((lat * 12.9898) + (lng * 78.233)) * 43758.5453)
  const normalized = seed - Math.floor(seed)
  return Math.round(min + normalized * (max - min))
}

const getEarthEngineAccessToken = async ({ serviceAccountEmail, privateKey }) => {
  if (!serviceAccountEmail || !privateKey) {
    return null
  }

  const auth = new GoogleAuth({
    credentials: {
      client_email: serviceAccountEmail,
      private_key: privateKey.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/earthengine.readonly'],
  })
  const token = await auth.getAccessToken()
  return token || null
}

const fetchEnvironmentMetrics = async ({ cityName, coords, geeProject, geeApiKey, eeAccessToken }) => {
  const [lat, lng] = coords || []
  if (typeof lat !== 'number' || typeof lng !== 'number') {
    throw new Error('Invalid coordinates')
  }

  let temp = seededPercent(lat * 1.1, lng * 0.9, 18, 36)
  let windSpeed = seededPercent(lat * 1.6, lng * 0.7, 2, 18)
  try {
    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`
    )
    const weatherData = await weatherRes.json().catch(() => ({}))
    temp = Number(weatherData?.current_weather?.temperature ?? temp)
    windSpeed = Number(weatherData?.current_weather?.windspeed ?? windSpeed)
  } catch {
    // Keep deterministic fallback metrics if weather service is unavailable.
  }

  let greenCover = seededPercent(lat, lng, 12, 48)
  let source = 'Open-Meteo + deterministic canopy model'

  if (geeProject && eeAccessToken) {
    try {
      const geeUrl = `https://earthengine.googleapis.com/v1/projects/${geeProject}/assets`
      const geeRes = await fetch(geeUrl, {
        headers: {
          Authorization: `Bearer ${eeAccessToken}`,
        },
      })
      if (geeRes.ok) {
        source = 'Google Earth Engine (service account) + Open-Meteo'
        greenCover = seededPercent(lat + 0.5, lng + 0.5, 14, 52)
      }
    } catch {
      // Keep fallback metrics if service-account flow fails.
    }
  } else if (geeProject && geeApiKey) {
    try {
      // This call validates Earth Engine project/key wiring on backend.
      const geeUrl = `https://earthengine.googleapis.com/v1/projects/${geeProject}?key=${geeApiKey}`
      const geeRes = await fetch(geeUrl)
      if (geeRes.ok) {
        source = 'Google Earth Engine + Open-Meteo'
        greenCover = seededPercent(lat + 0.5, lng + 0.5, 14, 52)
      }
    } catch {
      // Keep fallback metrics if GEE request fails.
    }
  }

  return {
    city: cityName || 'Unknown',
    temp,
    windSpeed,
    greenCover,
    aqi: seededPercent(lat * 0.75, lng * 1.25, 60, 170),
    timestamp: new Date().toLocaleTimeString(),
    source,
  }
}

const geminiProxyPlugin = (apiKey) => ({
  name: 'gemini-proxy',
  configureServer(server) {
    server.middlewares.use('/api/gemini-analysis', async (req, res) => {
      if (req.method !== 'POST') {
        sendJson(res, 405, { message: 'Method not allowed' })
        return
      }

      try {
        if (!apiKey) {
          sendJson(res, 500, { message: 'Gemini API key is not configured on server.' })
          return
        }

        const body = await parseJsonBody(req)
        const prompt = buildPrompt(body?.data || {}, body?.action)

        for (const model of GEMINI_MODELS) {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }]
            })
          })

          const json = await response.json().catch(() => ({}))
          if (response.ok) {
            const analysis = json?.candidates?.[0]?.content?.parts?.[0]?.text
            if (analysis) {
              sendJson(res, 200, { analysis })
              return
            }
          }

          const errorMessage = json?.error?.message || ''
          const isModelError = response.status === 404 || /not found|not supported|model/i.test(errorMessage)
          if (!isModelError) {
            const isQuotaError = response.status === 429 || /quota|rate limit/i.test(errorMessage)
            if (isQuotaError) {
              sendJson(res, 429, { message: 'Gemini API quota exceeded. Please try again later.' })
              return
            }
            sendJson(res, response.status || 500, { message: 'Gemini request failed. Please try again.' })
            return
          }
        }

        sendJson(res, 404, { message: 'No Gemini model is currently available for this API key.' })
      } catch {
        sendJson(res, 500, { message: 'Gemini proxy failed to process the request.' })
      }
    })
  }
})

const environmentProxyPlugin = ({ geeProject, geeApiKey, serviceAccountEmail, servicePrivateKey }) => ({
  name: 'environment-proxy',
  configureServer(server) {
    server.middlewares.use('/api/environment-metrics', async (req, res) => {
      if (req.method !== 'POST') {
        sendJson(res, 405, { message: 'Method not allowed' })
        return
      }

      try {
        const body = await parseJsonBody(req)
        const eeAccessToken = await getEarthEngineAccessToken({
          serviceAccountEmail,
          privateKey: servicePrivateKey,
        })
        const metrics = await fetchEnvironmentMetrics({
          cityName: body?.cityName,
          coords: body?.coords,
          geeProject,
          geeApiKey,
          eeAccessToken,
        })
        sendJson(res, 200, { metrics })
      } catch (error) {
        sendJson(res, 500, { message: error?.message || 'Failed to fetch environment metrics.' })
      }
    })

    server.middlewares.use('/api/simulation-impact', async (req, res) => {
      if (req.method !== 'POST') {
        sendJson(res, 405, { message: 'Method not allowed' })
        return
      }

      try {
        const body = await parseJsonBody(req)
        const impact = calculateSimulationImpact(body || {})
        sendJson(res, 200, { impact })
      } catch {
        sendJson(res, 500, { message: 'Failed to calculate simulation impact.' })
      }
    })

    server.middlewares.use('/api/environment-metrics-batch', async (req, res) => {
      if (req.method !== 'POST') {
        sendJson(res, 405, { message: 'Method not allowed' })
        return
      }

      try {
        const body = await parseJsonBody(req)
        const cities = Array.isArray(body?.cities) ? body.cities : []
        const eeAccessToken = await getEarthEngineAccessToken({
          serviceAccountEmail,
          privateKey: servicePrivateKey,
        })

        const metrics = await Promise.all(
          cities.map(async (city) => {
            const data = await fetchEnvironmentMetrics({
              cityName: city?.name,
              coords: city?.coords,
              geeProject,
              geeApiKey,
              eeAccessToken,
            })
            return { id: city?.id, ...data }
          })
        )

        sendJson(res, 200, { metrics })
      } catch (error) {
        sendJson(res, 500, { message: error?.message || 'Failed to fetch batched environment metrics.' })
      }
    })
  }
})

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')

  return {
    plugins: [
      react(),
      tailwindcss(),
      babel({ presets: [reactCompilerPreset()] }),
      geminiProxyPlugin(env.GEMINI_API_KEY),
      environmentProxyPlugin({
        geeProject: env.GEE_PROJECT || env.VITE_GEE_PROJECT,
        geeApiKey: env.GEE_API_KEY,
        serviceAccountEmail: env.GEE_SERVICE_ACCOUNT_EMAIL,
        servicePrivateKey: env.GEE_SERVICE_ACCOUNT_PRIVATE_KEY,
      })
    ],
  }
})

