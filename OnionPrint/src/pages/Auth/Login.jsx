//Icons
import lockIcon from '../../assets/lockIcon.png';
import googleIcon from '../../assets/googleIcon.png';
import exclamationIcon from '../../assets/exclamationIcon.png';

//Dependencies
import { Link, useNavigate } from 'react-router-dom';
import { validateEmail } from '../../utils/UserDataValidation';
import { useState } from 'react';
import { useAuth } from '../../auth/AuthContext'

//Style
import './Auth.css';

export default function Login() {

    const navigator = useNavigate();
    const { signInWithEmailPassword, signInWithGoogle } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({
        email: '',
        password: '',
        login: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Realizar validaciones antes de enviar los datos.
        var emailErrorMessage = validateEmail(formData.email) ? "" : "El correo electrónico no es válido."
        const emailError = formData.email === "" ? "Este campo no puede estar vacío" : emailErrorMessage;
        const passwordError = formData.password === "" ? "Debes introducir una contraseña" : "";

        setErrors({
            email: emailError,
            password: passwordError,
            login: ''
        });

        // Si no hay errores, puedes enviar los datos al servidor aquí.
        if (!emailError && !passwordError) {
            console.log('Datos válidos, enviando formulario...');
            try {
                await signInWithEmailPassword(formData.email, formData.password, navigator);
            } catch (error) {
                setErrors({
                    email: "",
                    password: "",
                    login: error.message
                });
                console.log("login: " + error.message);
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    return (
        <main className='main'>
            <div className="register">
                <div className="title">
                    <span className='titleSpan'>
                        <img src={lockIcon} alt="Imagen del título de la página de registro" />
                    </span>
                    <h1>Iniciar Sesión</h1>
                    <span className='loginError' style={{ display: errors.login === "" ? 'none' : 'block' }}>El correo electrónico o la contraseña son incorrectos</span>
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
                            autoComplete='email'
                        />
                        <div className='error' style={{ display: errors.email === '' ? 'none' : 'flex' }}>
                            <img src={exclamationIcon} alt='exclamationIcon' />
                            <p>{errors.email}</p>
                        </div>
                    </div>
                    <div className='inputGroup'>
                        <div className='passwordLabels'>
                            <label htmlFor="password" className='passwordLabel'>Contraseña</label>
                            <Link to='/forgotpassword' className='forgotPasswordLabel'>¿Has olvidado tu contraseña?</Link>
                        </div>
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
                    <input type="submit" value="INICIAR SESIÓN" className='inputSubmit' />
                </form>

                <div className='loginSocial'>
                    <span onClick={() => signInWithGoogle(navigator)}>
                        <img src={googleIcon} alt="Imagen para iniciar sesión con Google" />
                    </span>
                </div>

                <div className='haveAccount'>
                    <p className='haveAccount_title'>¿Eres nuevo en OnionPrint?</p>
                    <Link to='/register' className='haveAccount_link'>¡Crea tu cuenta ahora!</Link>
                </div>
            </div>
        </main>
    );
}