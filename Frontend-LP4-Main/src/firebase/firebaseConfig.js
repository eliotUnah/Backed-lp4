// frontend/src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
apiKey: "AIzaSyDTgfDgvGL-G5pyOPcmB4vQrOF4cVDdXuE",
  authDomain: "habit-wise-42192.firebaseapp.com",
  projectId: "habit-wise-42192",

};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
