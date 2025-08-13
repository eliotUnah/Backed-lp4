const { initializeApp } = require("firebase/app");
const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");

const firebaseConfig = {
  apiKey: "AIzaSyDTgfDgvGL-G5pyOPcmB4vQrOF4cVDdXuE",
  authDomain: "habit-wise-42192.firebaseapp.com",
};

const app = initializeApp(firebaseConfig); // 

const auth = getAuth(app);

const email = "eliasiriasvalla12@gmail.com"; // debe existir en Firebase Auth
const password = "charmander2005";        // contraseña válida

signInWithEmailAndPassword(auth, email, password)
  .then(async (userCredential) => {
    const idToken = await userCredential.user.getIdToken();
    console.log(" ID Token:", idToken);
    process.exit(0);
  })
  .catch((error) => {
    console.error(" Error al iniciar sesión:", error.message);
    process.exit(1);
  });
  