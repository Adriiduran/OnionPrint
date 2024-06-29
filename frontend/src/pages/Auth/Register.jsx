//Dependencies
import { Link, useNavigate } from 'react-router-dom';
import { validateEmail, validatePassword } from '../../utils/UserDataValidation';
import { useState, useEffect } from 'react';

//Style
import './Auth.css';
import { useAuth } from '../../auth/AuthContext';

export default function Register() {

    const navigator = useNavigate();
    const { registerUser, signInWithGoogle, user } = useAuth();

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

    useEffect(() => {
        if (user && user.email !== '') {
            navigator('/')
        }
    }, [user])

    const handleSubmit = (e) => {
        e.preventDefault();
        // Realizar validaciones antes de enviar los datos.
        var emailErrorMessage = validateEmail(formData.email) ? "" : "El correo electrónico no es válido."
        var passwordErrorMessage = validatePassword(formData.password) ? "" : "La contraseña debe tener al menos 8 caracteres, una mayúscula y un número."
        const emailError = formData.email === "" ? "Este campo no puede estar vacío" : emailErrorMessage;
        const passwordError = formData.password === "" ? "Este campo no puede estar vacío" : passwordErrorMessage;
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
            registerUser(formData.email, formData.password, navigator)
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
        <main className='mainAuth'>
            <div className="registerAuth">
                <div className="titleAuth">
                    <span className='titleSpanAuth'>
                        <img src={`${import.meta.env.VITE_ASSETS_URL}/lockIcon.png`} alt="Imagen del título de la página de registro" />
                    </span>
                    <h1>Crear cuenta</h1>
                </div>

                <form onSubmit={handleSubmit} action='post' className="formAuth">
                    <div className='inputGroupAuth'>
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
                        <div className='errorAuth' style={{ display: errors.email === '' ? 'none' : 'flex' }}>
                            <img src={`${import.meta.env.VITE_ASSETS_URL}/exclamationIcon.png`} alt='exclamationIcon' />
                            <p>{errors.email}</p>
                        </div>
                    </div>
                    <div className='inputGroupAuth'>
                        <label htmlFor="password">Contraseña</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            placeholder='Contraseña'
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <div className='errorAuth' style={{ display: errors.password === '' ? 'none' : 'flex' }}>
                            <img src={`${import.meta.env.VITE_ASSETS_URL}/exclamationIcon.png`} alt='exclamationIcon' />
                            <p>{errors.password}</p>
                        </div>
                    </div>
                    <div className='inputGroupAuth'>
                        <label htmlFor="passwordRepetition">Repetir Contraseña</label>
                        <input
                            type="password"
                            name="passwordRepetition"
                            id="passwordRepetition"
                            placeholder='Repetir Contraseña'
                            value={formData.passwordRepetition}
                            onChange={handleChange}
                        />
                        <div className='errorAuth' style={{ display: errors.passwordRepetition === '' ? 'none' : 'flex' }}>
                            <img src={`${import.meta.env.VITE_ASSETS_URL}/exclamationIcon.png`} alt='exclamationIcon' />
                            <p>{errors.passwordRepetition}</p>
                        </div>
                    </div>

                    <input type="submit" value="CREAR CUENTA" className='inputSubmitAuth' />
                </form>

                <div className='loginSocialAuth'>
                    <span onClick={() => signInWithGoogle(navigator)}>
                        <img src={`${import.meta.env.VITE_ASSETS_URL}/googleIcon.png`} alt="Imagen para iniciar sesión con Google" />
                    </span>
                </div>

                <div className='haveAccountAuth'>
                    <p className='haveAccount_titleAuth'>¿Ya tienes una cuenta?</p>
                    <Link to='/login' className='haveAccount_linkAuth'>¡Inicia sesión aquí!</Link>
                </div>
            </div>
        </main>
    );
}