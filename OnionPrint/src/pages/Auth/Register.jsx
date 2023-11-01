//Icons
import lockIcon from '../../assets/lockIcon.png';
import googleIcon from '../../assets/googleIcon.png';
import appleIcon from '../../assets/appleIcon.png';
import exclamationIcon from '../../assets/exclamationIcon.png';

//Dependencies
import { Link, useNavigate } from 'react-router-dom';
import { validateEmail, validatePassword, signInWithGoogle, registerUser } from '../../utils/User';
import { useState } from 'react';

//Style
import './Auth.css';

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

    const handleSubmit = (e) => {
        e.preventDefault();
        // Realizar validaciones antes de enviar los datos.
        const emailError = formData.email === "" ? "Este campo no puede estar vacío" : validateEmail(formData.email);
        const passwordError = formData.password === "" ? "Este campo no puede estar vacío" : validatePassword(formData.password);
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
        <main className='main'>
            <div className="register">
                <div className="title">
                    <span className='titleSpan'>
                        <img src={lockIcon} alt="Imagen del título de la página de registro" />
                    </span>
                    <h1>Crear cuenta</h1>
                </div>

                <form onSubmit={handleSubmit} action='post' className="form">
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

                <div className='loginSocial'>
                    <span onClick={() => signInWithGoogle(navigator)}>
                        <img src={googleIcon} alt="Imagen para iniciar sesión con Google" />
                    </span>
                    <span>
                        <img src={appleIcon} alt="Imagen para iniciar sesión con Apple" />
                    </span>
                </div>

                <div className='haveAccount'>
                    <p className='haveAccount_title'>¿Ya tienes una cuenta?</p>
                    <Link to='/login' className='haveAccount_link'>¡Inicia sesión aquí!</Link>
                </div>
            </div>
        </main>
    );
}