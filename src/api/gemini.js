/**
 * Generates an environmental impact analysis using a server-side proxy.
 * This keeps the Gemini API key out of the browser bundle.
 */
export const getGeminiAnalysis = async (data, action) => {
  try {
    const response = await fetch("/api/gemini-analysis", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data, action }),
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      return payload.message || "Analysis currently unavailable. Please try again.";
    }

    return payload.analysis || "Analysis currently unavailable. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error?.message || "Unknown error");
    return "Analysis currently unavailable. Please check your connectivity or API limits.";
  }
};
