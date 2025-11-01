import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🌍 Variable global para guardar la última posición
let ultimaPosicion = { lat: null, lon: null, id: null, ts: null };

/**
 * 📡 Endpoint que recibe coordenadas desde Traccar u otra app
 */
app.post("/api/positions", async (req, res) => {
  try {
    console.log("🔍 Body recibido:", JSON.stringify(req.body));

    const data = Array.isArray(req.body) ? req.body[0] : req.body;

    const id =
      data.id_dispositivo || data.deviceId || data.device || "sin_id";
    const lat =
      data.location?.coords?.latitude ||
      data.latitude ||
      data.lat ||
      data.latitud;
    const lon =
      data.location?.coords?.longitude ||
      data.longitude ||
      data.lon ||
      data.lng ||
      data.longitud;

    console.log(`📍 Recibido de ${id}: ${lat}, ${lon}`);

    if (lat && lon) {
      // ✅ Guardamos en memoria para que el mapa lo consulte
      ultimaPosicion = {
        id,
        lat: parseFloat(lat),
        lon: parseFloat(lon),
        ts: new Date().toISOString(),
      };

      // 🚀 Enviar a tu Google Script (actualiza hoja)
      const GAS_URL =
        "https://script.google.com/macros/s/AKfycbwzBsHiyEDjC52WdIP63fEz0edIY2coJGVD9ZcORFEhltZpRfWptOQnbavCoxP8bcU/exec";
      await fetch(`${GAS_URL}?id=${id}&lat=${lat}&lng=${lon}`);

      console.log("✅ Coordenadas enviadas a Google Sheet");
    } else {
      console.warn("⚠️ Coordenadas inválidas");
    }

    res.status(200).send("OK");
  } catch (err) {
    console.error("❌ Error al procesar:", err.message);
    res.status(500).send("Error interno");
  }
});

/**
 * 🔁 Endpoint que el mapa consulta para mostrar la posición actual
 */
app.get("/api/live", (req, res) => {
  res.json(ultimaPosicion);
});

/**
 * 🏠 Página raíz para pruebas
 */
app.get("/", (req, res) => {
  res.send("Servidor activo VIGO 🚀");
});

/**
 * 🚀 Inicialización
 */
const PORT = process.env.PORT || 10000;
app.listen(PORT, () =>
  console.log(`✅ Servidor escuchando en puerto ${PORT}`)
);
