//Icons
import lockIcon from '../../assets/lockIcon.png';
import googleIcon from '../../assets/googleIcon.png';
import appleIcon from '../../assets/appleIcon.png';
import exclamationIcon from '../../assets/exclamationIcon.png';

//Dependencies
import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import app from '../../config/firebase.js';

//Style
import { useState } from 'react';
import './Register.css';

export default function Register() {

    const navigator = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        passwordRepetition: '',
    });

    const [errors, setErrors] = useState({
        email: '',
        password: '',
        passwordRepetition: '',
    });

    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

        if (!emailRegex.test(email)) {
            return 'El correo electrónico no es válido.';
        }
        return '';
    };


    const validatePassword = (password) => {
        if (password.length < 8 || !/[A-Z]/.test(password) || !/\d/.test(password)) {
            return 'La contraseña debe tener al menos 8 caracteres, una mayúscula y un número.'
        }
        return '';
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Realizar validaciones antes de enviar los datos.
        const emailError = validateEmail(formData.email);
        const passwordError = validatePassword(formData.password);
        const passwordRepetitionError =
            formData.password !== formData.passwordRepetition
                ? 'Las contraseñas no coinciden.'
                : '';

        setErrors({
            email: emailError,
            password: passwordError,
            passwordRepetition: passwordRepetitionError,
        });

        // Si no hay errores, puedes enviar los datos al servidor aquí.
        if (!emailError && !passwordError && !passwordRepetitionError) {
            console.log('Datos válidos, enviando formulario...');
            const auth = getAuth(app);
            createUserWithEmailAndPassword(auth, formData.email, formData.password)
                .then((userCredential) => {
                    // Signed in 
                    const user = userCredential.user;
                    console.log(user.displayName)
                    console.log(user.email)

                    // Redirige al usuario a la pantalla de inicio
                    navigator('/')
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log('errorCode: ' + errorCode)
                    console.log('errorMessage: ' + errorMessage)
                });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSignInWithGoogle = () => {
        const auth = getAuth();
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                const user = result.user;
                console.log(`token: ${token}`)

                for (const clave in user) {
                    const valor = user[clave];
                    console.log(`Clave: ${clave}, Valor: ${valor}`);
                }

                // Redirige al usuario a la pantalla de inicio
                navigator('/')

            }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                const email = error.customData.email;
                const credential = GoogleAuthProvider.credentialFromError(error);
                console.log(`errorCode: ${errorCode}, errorMessage: ${errorMessage}, email: ${email}, credential: ${credential}`)
            });
    };

    return (
        <main className='main'>
            <div className="register">
                <div className="title">
                    <span>
                        <img src={lockIcon} alt="Imagen del título de la página de registro" />
                    </span>
                    <h1>Crear cuenta</h1>
                </div>
                <form onSubmit={handleSubmit} className="form">
                    <div className='inputGroup'>
                        <label htmlFor="email">Correo Electrónico</label>
                        <input
                            type="text"
                            name="email"
                            id="email"
                            placeholder='Correo Electrónico'
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <div className='error' style={{ display: errors.email === '' ? 'none' : 'flex' }}>
                            <img src={exclamationIcon} alt='exclamationIcon' />
                            <p>{errors.email}</p>
                        </div>
                    </div>
                    <div className='inputGroup'>
                        <label htmlFor="password">Contraseña</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            placeholder='Contraseña'
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <div className='error' style={{ display: errors.password === '' ? 'none' : 'flex' }}>
                            <img src={exclamationIcon} alt='exclamationIcon' />
                            <p>{errors.password}</p>
                        </div>
                    </div>
                    <div className='inputGroup'>
                        <label htmlFor="passwordRepetition">Repetir Contraseña</label>
                        <input
                            type="password"
                            name="passwordRepetition"
                            id="passwordRepetition"
                            placeholder='Repetir Contraseña'
                            value={formData.passwordRepetition}
                            onChange={handleChange}
                        />
                        <div className='error' style={{ display: errors.passwordRepetition === '' ? 'none' : 'flex' }}>
                            <img src={exclamationIcon} alt='exclamationIcon' />
                            <p>{errors.passwordRepetition}</p>
                        </div>
                    </div>

                    <input type="submit" value="CREAR CUENTA" className='inputSubmit' />
                </form>

                <hr />

                <div className='loginSocial'>
                    <span onClick={handleSignInWithGoogle}>
                        <img src={googleIcon} alt="Imagen para iniciar sesión con Google" />
                    </span>
                    <span>
                        <img src={appleIcon} alt="Imagen para iniciar sesión con Apple" />
                    </span>
                </div>
            </div>
        </main>
    );
}