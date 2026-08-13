/**
 * Environmental Simulation Formulas for GreenLens
 */

/**
 * Calculates temperature change based on greening action and hectares
 * @param {string} action - 'plant' | 'remove'
 * @param {number} hectares - Amount of area impacted
 * @returns {number} Temperature delta in Celsius
 */
export const calculateTempChange = (action, hectares) => {
  const factor = 0.05; // 0.05°C cooling per hectare of dense canopy
  return action === 'plant' ? -(hectares * factor) : +(hectares * factor);
};

/**
 * Calculates flood risk reduction based on greening
 * @param {string} action - 'plant' | 'remove'
 * @param {number} hectares - Amount of area impacted
 * @returns {number} Percentage change in flood risk
 */
export const calculateFloodChange = (action, hectares) => {
  const factor = 0.8; // 0.8% risk reduction per hectare
  return action === 'plant' ? -(hectares * factor) : +(hectares * factor);
};

/**
 * Calculates AQI improvement based on greening
 * @param {string} action - 'plant' | 'remove'
 * @param {number} hectares - Amount of area impacted
 * @returns {number} AQI point change
 */
export const calculateAQIChange = (action, hectares) => {
  const factor = 1.2; // 1.2 AQI points improvement per hectare
  return action === 'plant' ? -(hectares * factor) : +(hectares * factor);
};

/**
 * Calculates the GreenLens Score (0-100)
 * Higher is better (greener, cooler, safer)
 */
export const calculateGreenLensScore = (temp, floodRiskPct, aqi, greenCoverPct) => {
  // Normalize components to 0-25 each
  const tempScore = Math.max(0, 25 - (temp - 20) * 1.5);
  const floodScore = Math.max(0, 25 - floodRiskPct / 4);
  const aqiScore = Math.max(0, 25 - aqi / 12);
  const greenScore = Math.min(25, greenCoverPct / 4 * 2.5);
  
  return Math.round(tempScore + floodScore + aqiScore + greenScore);
};

/**
 * Suggests number of trees needed for a desired cooling effect
 */
export const calculateTreesNeeded = (tempDelta) => {
  // Rough estimate: 200 trees for 1 hectare (~0.05°C)
  const hectaresNeeded = Math.abs(tempDelta) / 0.05;
  return Math.round(hectaresNeeded * 200);
};

/**
 * Calculates green cover percentage change
 */
export const calculateGreenCoverChange = (action, hectares, totalArea) => {
  const pct = Math.round((hectares / totalArea) * 100);
  return action === 'plant' ? pct : -pct;
};

/**
 * Checks for social equity alerts (high density + low green cover)
 */
export const checkEquityAlert = (popDensity, greenCover) => {
  return popDensity > 400 && greenCover < 15;
};
