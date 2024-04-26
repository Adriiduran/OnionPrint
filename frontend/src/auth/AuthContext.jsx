import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  signOut
} from 'firebase/auth';
import { app } from '../config/firebase';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const auth = getAuth(app);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    // Limpiar el efecto al desmontar el componente
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user && user.email === 'admin@onionprint.es') {
      setIsAdmin(true)
    } else {
      setIsAdmin(false)
    }
  }, [user])

  const registerUser = async (email, password, navigator) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user

      setUser(user);

      toast.success('Cuenta creada!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        theme: 'light',
      });

      navigator('/');
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log('errorCode: ' + errorCode);
      console.log('errorMessage: ' + errorMessage);
    }
  };

  const signInWithEmailPassword = async (email, password, navigator) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    setUser(user);

    toast.success('Inicio correcto!', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      theme: 'light',
    });

    if (!isAdmin) {
      navigator('/');
    }
  };

  const adminVerification = async (email, password, navigator) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    if (userCredential && userCredential.user && userCredential.user.email === 'admin@onionprint.es') {
      setIsAdmin(true);

      navigator('/admin/home');
    } else {
      throw new Error('Credenciales inválidas');
    }
  };

  const signInWithGoogle = async (navigator) => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;

      setUser(user);

      toast.success('Inicio correcto!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        theme: 'light',
      });

      navigator('/');
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
      console.log(
        `errorCode: ${errorCode}, errorMessage: ${errorMessage}, email: ${email}, credential: ${credential}`
      );
    }
  };

  const resetPassword = async (email, navigator) => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        toast.success('Correo enviado!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          theme: 'light',
        });
        navigator('/login');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const logout = async (navigator) => {
    try {
      await signOut(auth);

      toast.success('Sesión cerrada!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        theme: 'light',
      });

      navigator("/");
    } catch (error) {
      console.error('Error durante el Logout:', error);
      toast.error('Error al cerrar sesión', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        theme: 'light',
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, registerUser, signInWithGoogle, signInWithEmailPassword, resetPassword, logout, adminVerification, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export const useAuth = () => {
  return useContext(AuthContext);
};
