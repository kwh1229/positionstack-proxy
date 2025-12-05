// api/forward.js
export default async function handler(req, res) {
  const query = req.query.query;

  if (!query) {
    return res.status(400).json({ error: "Missing 'query' parameter" });
  }

  const url = `http://api.positionstack.com/v1/forward?access_key=087adc70e3d6b23f0b1c7ee4713cac66&query=${encodeURIComponent(query)}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: "Failed to reach PositionStack", details: err.message });
  }
}
