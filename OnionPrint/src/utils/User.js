import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import app from "../config/firebase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function validateEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  if (!emailRegex.test(email)) {
    return "El correo electrónico no es válido.";
  }
  return "";
}

function validatePassword(password) {
  if (password.length < 8 || !/[A-Z]/.test(password) || !/\d/.test(password)) {
    return "La contraseña debe tener al menos 8 caracteres, una mayúscula y un número.";
  }
  return "";
}

async function registerUser(email, password, navigator) {
  const auth = getAuth(app);
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    console.log(user.displayName);
    console.log(user.email);

    toast.success("Cuenta creada con éxito!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      theme: "light",
    });

    navigator("/");
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log("errorCode: " + errorCode);
    console.log("errorMessage: " + errorMessage);
  }
}

async function signInWithEmailPassword(email, password, navigator) {
  const auth = getAuth(app);
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    toast.success("Inicio de sesión correcto!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      theme: "light",
    });

    navigator("/");
  } catch (error) {
    console.error(
      "Error al iniciar sesión con correo electrónico y contraseña:",
      error
    );
  }
}

async function signInWithGoogle(navigator) {
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    const user = result.user;

    toast.success("Inicio de sesión correcto!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      theme: "light",
    });

    navigator("/");
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    const email = error.customData.email;
    const credential = GoogleAuthProvider.credentialFromError(error);
    console.log(
      `errorCode: ${errorCode}, errorMessage: ${errorMessage}, email: ${email}, credential: ${credential}`
    );
  }
}

async function signInWithApple() {
  //TODO: Crear el método para poder registrarse con Apple
}

async function resetPassword(email, navigator) {
  const auth = getAuth(app);
  sendPasswordResetEmail(auth, email)
    .then(() => {
      toast.success("Correo de recuperación enviado!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        theme: "light",
      });
      navigator("/login");
    })
    .catch((error) => {
      console.log(error);
    });
}

export {
  validateEmail,
  validatePassword,
  registerUser,
  signInWithGoogle,
  signInWithApple,
  signInWithEmailPassword,
  resetPassword,
};
