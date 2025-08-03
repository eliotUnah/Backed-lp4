require('dotenv').config(); // debe estar al inicio
const { google } = require("googleapis");
const User = require("../models/user-model");

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const SCOPES = ["https://www.googleapis.com/auth/calendar"];

const startAuth = (req, res) => {
  const { uid } = req.user;

  // 🧪 Verifica que el usuario existe antes de redirigir
  console.log("🔐 Iniciando vinculación para UID:", uid);

  const url = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
    state: JSON.stringify({ uid }),
  });

  console.log("🌐 Redirigiendo a:", url);
  res.redirect(url);
};
const handleCallback = async (req, res) => {
  try {
    const { code, state } = req.query;

    console.log("📥 Código recibido:", code);
    console.log("📦 Estado recibido:", state);

    const parsedState = JSON.parse(state);
    const uid = parsedState.uid;

    console.log("🔐 UID extraído de state:", uid);
    console.log("🔧 Configuración OAuth:", {
      clientId: oAuth2Client._clientId,
      redirectUri: oAuth2Client.redirectUri,
    });

    const { tokens } = await oAuth2Client.getToken(code);
    console.log("✅ Tokens recibidos:", tokens);

    oAuth2Client.setCredentials(tokens);

    const result = await User.findOneAndUpdate({ uid }, { googleTokens: tokens });
    console.log("💾 Tokens guardados en usuario:", result);

    // 🔁 Redirige al frontend con los parámetros necesarios
  const user = await User.findOne({ uid });
  if (user.googleTokens?.access_token) {
  return res.redirect("http://localhost:3000/calendario?vinculacion=ok");
}

  } catch (error) {
    console.error("❌ Error en callback:", error.response?.data || error.message || error);
    res.status(500).json({
      message: "🚨 Error al guardar tokens de Google",
    });
  }
};
// 🎯 Sincroniza hábitos con Google Calendar
const checkLinkStatus = async (req, res) => {
  try {
    const { uid } = req.user;
    console.log("🔍 Verificando estado de vinculación para UID:", uid);

    const user = await User.findOne({ uid });

    const isLinked =
      !!user?.googleTokens?.access_token &&
      !!user?.googleTokens?.refresh_token &&
      !!user?.googleTokens?.expiry_date;

    res.json({ linked: isLinked });
  } catch (error) {
    console.error("❌ Error al verificar vinculación:", error.message || error);
    res.status(500).json({ linked: false, message: "Error al verificar estado de vinculación" });
  }
};

module.exports = { startAuth, handleCallback, checkLinkStatus }; 