import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/api/positions", async (req, res) => {
  try {
    console.log("🔍 Body recibido:", JSON.stringify(req.body));

    const data = req.body;
    const position = Array.isArray(data) ? data[0] : data;

    const id = position.id_dispositivo || position.device || "sin_id";
    const lat = position.location?.coords?.latitude || position.latitude;
    const lon = position.location?.coords?.longitude || position.longitude;

    console.log(`📍 Recibido de ${id}: ${lat}, ${lon}`);

    // Enviar a tu Google Script
    const GAS_URL = "https://script.google.com/macros/s/AKfycbwygjHBSLtc2-l3_wbzdfO00zGNP9Sf97yHrf40cfqN5bxAVQ7QiPfr2OPkJdA-se6R/exec";
    if (lat && lon) {
      await fetch(`${GAS_URL}?id=${id}&lat=${lat}&lng=${lon}`);
      console.log("✅ Coordenadas enviadas a Google Sheet");
    } else {
      console.warn("⚠️ No se encontraron coordenadas válidas");
    }

    res.status(200).send("OK");
  } catch (err) {
    console.error("❌ Error al procesar:", err.message);
    res.status(500).send("Error");
  }
});

app.get("/", (req, res) => res.send("Servidor activo VIGO 🚀"));
app.listen(10000, () => console.log("✅ Servidor escuchando en puerto 10000"));
