import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

// URL de tu Apps Script (la que actualiza la hoja Google)
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbztSPjpIR8xjmNwa2mcY99pYMnMqo5eSJSjPo2hOoVo7MoVdTt0ZayiyjERokftjWNerw/exec";

app.use(bodyParser.json());

// Endpoint que recibe datos desde Traccar
app.post("/api/positions", async (req, res) => {
  try {
    const { latitude, longitude } = req.body || {};
    if (!latitude || !longitude) {
      return res.status(400).send("Faltan coordenadas");
    }

    // Enviar coordenadas al Apps Script
    const url = `${SCRIPT_URL}?lat=${latitude}&lng=${longitude}`;
    await fetch(url);

    res.status(200).send("OK");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error interno del servidor");
  }
});

app.get("/", (req, res) => {
  res.send("Servidor VIGO activo. Esperando coordenadas de Traccar...");
});

app.listen(PORT, () => console.log(`✅ Servidor VIGO escuchando en puerto ${PORT}`));
