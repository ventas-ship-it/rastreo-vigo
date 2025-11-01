import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔹 Endpoint donde Traccar envía coordenadas
app.post("/api/positions", async (req, res) => {
  try {
    const { id, lat, lon } = req.body;

    // ✅ Mostramos en consola lo recibido
    console.log(`📍 Recibido de ${id}: ${lat}, ${lon}`);

    // 🔹 Enviamos las coordenadas a tu Google Apps Script
    const GAS_URL =
      "https://script.google.com/macros/s/AKfycbztSPjpIR8xjmNwa2mcY99pYMnMqo5eSJSjPo2hOoVo7MoVdTt0ZayiyjERokftjWNerw/exec";
    await fetch(`${GAS_URL}?lat=${lat}&lng=${lon}`);

    res.status(200).send("OK");
  } catch (err) {
    console.error("❌ Error al procesar:", err.message);
    res.status(500).send("Error");
  }
});

app.get("/", (req, res) => res.send("Servidor activo VIGO 🚀"));
app.listen(10000, () => console.log("✅ Servidor escuchando en puerto 10000"));
