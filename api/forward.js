export default async function handler(req, res) {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Missing query parameter" });
  }

  // ✅ Must use HTTPS
  const apiUrl = `https://api.positionstack.com/v1/forward?access_key=087adc70e3d6b23f0b1c7ee4713cac66&query=${encodeURIComponent(query)}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    // ✅ Log for debugging — will show in Vercel "Function Logs"
    console.log("Positionstack API response:", JSON.stringify(data, null, 2));

    if (!data || !data.data || data.data.length === 0) {
      return res.status(404).json({ error: "No results found" });
    }

    const result = data.data[0];

    res.setHeader("Content-Type", "application/json");

    return res.status(200).json({
      latitude: result.latitude,
      longitude: result.longitude,
      label: result.label,
      confidence: result.confidence ?? null
    });
  } catch (err) {
    console.error("API Proxy error:", err);
    return res.status(500).json({ error: "Proxy error", details: err.message });
  }
}

// ✅ This is CRITICAL — forces Vercel to use Node.js runtime instead of Edge
export const config = {
  runtime: 'nodejs'
};
