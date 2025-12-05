// /api/forward.js (Next.js API route or Express endpoint)

export default async function handler(req, res) {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: "Missing 'query' parameter" });
    }

    // Build PositionStack request URL
    const apiKey = process.env.POSITIONSTACK_API_KEY;
    const url = `http://api.positionstack.com/v1/forward?access_key=${apiKey}&query=${encodeURIComponent(query)}`;

    // Fetch the data
    const response = await fetch(url);
    if (!response.ok) {
      const text = await response.text();
      console.error("PositionStack error:", text);
      return res.status(response.status).json({ error: "Upstream PositionStack error" });
    }

    // Parse JSON properly
    const data = await response.json();

    // Return only necessary data
    return res.status(200).json({
      success: true,
      query,
      coordinates: data.data?.[0]
        ? {
            latitude: data.data[0].latitude,
            longitude: data.data[0].longitude,
            label: data.data[0].label,
            confidence: data.data[0].confidence,
          }
        : null,
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return res.status(500).json({ error: "Internal server error", details: error.message });
  }
}
