import express from "express";
import fetch from "node-fetch";
import cors from "cors"; // ✅ Nuevo

const app = express();
app.use(cors()); // ✅ Permite peticiones desde cualquier dominio (Apps Script incluido)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Guardamos última posición recibida en memoria
let ultimaPosicion = { id: null, lat: null, lon: null, ts: null };

app.post("/api/positions", async (req, res) => {
  try {
    console.log("🔍 Body recibido:", JSON.stringify(req.body));

    const data = req.body;
    const position = Array.isArray(data) ? data[0] : data;

    const id = position.id_dispositivo || position.device_id || "sin_id";
    const lat = position.location?.coords?.latitude || position.latitude;
    const lon = position.location?.coords?.longitude || position.longitude;

    console.log(`📍 Recibido de ${id}: ${lat}, ${lon}`);

    if (lat && lon) {
      // Guardamos posición en memoria (para el mapa)
      ultimaPosicion = { id, lat, lon, ts: new Date().toISOString() };

      // ✅ Enviar a Google Sheets (opcional)
      const GAS_URL = "https://script.google.com/macros/s/AKfycbwygjHBSLtc2-l3_wbzdfO00zGNP9Sf97yHrf40cfqN5bxAVQ7QiPfr2OPkJdA-se6R/exec";
      try {
        await fetch(`${GAS_URL}?id=${id}&lat=${lat}&lng=${lon}`);
        console.log("✅ Coordenadas enviadas a Google Sheet");
      } catch (err) {
        console.warn("⚠️ No se pudo enviar a la hoja:", err.message);
      }

      res.status(200).send("OK");
    } else {
      console.warn("⚠️ No se encontraron coordenadas válidas");
      res.status(400).send("Faltan coordenadas");
    }
  } catch (err) {
    console.error("❌ Error al procesar:", err.message);
    res.status(500).send("Error interno");
  }
});

// 🔴 Nuevo endpoint para el mapa en vivo
app.get("/api/live", (req, res) => {
  res.json(ultimaPosicion);
});

// 🌐 Página principal simple
app.get("/", (req, res) => res.send("Servidor activo GIOX 🚀"));

app.listen(10000, () => console.log("✅ Servidor escuchando en puerto 10000"));

