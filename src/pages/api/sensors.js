export default function handler(req, res) {
  if (req.method === "GET") {
    res.status(200).json({ status: "ok", message: "Sensor Api UP" });
  }
  if (req.method === "POST") {
    const body = req.body;
    res.status(200).json({ status: "ok", message: "New Data Received" });
  }
}
