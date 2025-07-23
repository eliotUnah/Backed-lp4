const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
  let token;

  // 1. Prioridad: token por cookie
  if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  // 2. Opción alternativa: token por header (Bearer ...)
  else if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "🚫 Token de autenticación no proporcionado" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      uid: decoded.uid,
      email: decoded.email,
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "❌ Token inválido o expirado" });
  }
};

module.exports = authenticateUser;
