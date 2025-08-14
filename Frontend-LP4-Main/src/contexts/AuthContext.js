import React, { useContext, useState, useEffect } from "react";
import { auth } from "../firebase/firebaseConfig";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from "firebase/auth";
import axios from "axios";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔐 LOGIN: Firebase + envío al backend
  const login = async (email, password) => {
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCred.user.getIdToken();

      // Solo en login se envía al backend para crear cookie httpOnly con JWT
      await axios.post(
        "http://localhost:5000/auth/iniciar-sesion",
        { idToken },
        { withCredentials: true }
      );

      setCurrentUser(userCred.user);
    } catch (error) {
      // Aquí puedes agregar manejo de errores más específico
      throw error;
    }
  };

  // SIGNUP: solo crea la cuenta, no llama al backend
  const signup = async (email, password) => {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    setCurrentUser(userCred.user);
    return userCred;
  };

  // LOGOUT: Solo Firebase, no backend (no tienes ruta logout)
  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  // Verificar sesión backend y Firebase onAuthStateChanged
  useEffect(() => {
    // Primero escuchar cambios en Firebase
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          // Preguntar al backend si hay sesión válida con la cookie
          const res = await axios.get("http://localhost:5000/auth/usuario-actual", {
            withCredentials: true,
          });

          if (res.data?.user) {
            setCurrentUser(res.data.user);
          } else {
            setCurrentUser(null);
          }
        } catch {
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    logout,
    signup,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
