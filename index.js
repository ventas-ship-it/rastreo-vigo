import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/api/positions", async (req, res) => {
  try {
    console.log("🔍 Body recibido:", JSON.stringify(req.body)); // 👈 NUEVO: mostramos todo el body

    const data = req.body;
    const position = Array.isArray(data) ? data[0] : data;

    const id = position.device || position.id || "sin_id";
    const lat = position.latitude || position.lat;
    const lon = position.longitude || position.lon;

    console.log(`📍 Recibido de ${id}: ${lat}, ${lon}`);

    const GAS_URL = "https://script.google.com/macros/s/AKfycbztSPjpIR8xjmNwa2mcY99pYMnMqo5eSJSjPo2hOoVo7MoVdTt0ZayiyjERokftjWNerw/exec";
    await fetch(`${GAS_URL}?id=${id}&lat=${lat}&lng=${lon}`);

    res.status(200).send("OK");
  } catch (err) {
    console.error("❌ Error al procesar:", err.message);
    res.status(500).send("Error");
  }
});

app.get("/", (req, res) => res.send("Servidor activo VIGO 🚀"));
app.listen(10000, () => console.log("✅ Servidor escuchando en puerto 10000"));
