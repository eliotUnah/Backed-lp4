const admin = require("firebase-admin");
const serviceAccount = require("./config/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

//  UID del usuario para poder revocar el token, se saca del firebase en usuarios.
const uid = "HBbdxzeRMiMrvhWrxfq8lKTzXOm2"; 

admin
  .auth()
  .revokeRefreshTokens(uid)
  .then(() => {
    console.log("✅ Token revocado correctamente");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error revocando token:", error);
    process.exit(1);
  });