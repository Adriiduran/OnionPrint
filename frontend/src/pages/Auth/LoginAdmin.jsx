//Dependencies
import { useNavigate } from 'react-router-dom';
import { validateEmail } from '../../utils/UserDataValidation';
import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext'

//Style
import './Auth.css';

export default function LoginAdmin() {

    const navigator = useNavigate();
    const { adminVerification, isAdmin } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({
        email: '',
        password: '',
        login: ''
    });

    useEffect(() => {
        if (isAdmin) {
            navigator('/admin/orders')
        }
    }, [isAdmin])

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
            try {
                await adminVerification(formData.email, formData.password, navigator)
            } catch (error) {
                setErrors({
                    email: "",
                    password: "",
                    login: error.message
                });
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
        <main className='mainAuth'>
            <div className="registerAuth">
                <div className="titleAuth">
                    <span className='titleSpanAuth'>
                        <img src={`${import.meta.env.VITE_ASSETS_URL}/lockIcon.webp`} alt="Imagen del título de la página de registro" />
                    </span >
                    <h1>Iniciar Sesión</h1>
                    <span className='loginErrorAuth' style={{ display: errors.login === "" ? 'none' : 'block' }}>El correo electrónico o la contraseña son incorrectos</span>
                </div >

                <form onSubmit={handleSubmit} className="formAuth">
                    <div className='inputGroupAuth'>
                        <label htmlFor="emailAuth">Correo Electrónico</label>
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
                            <img src={`${import.meta.env.VITE_ASSETS_URL}/exclamationIcon.webp`} alt='exclamationIcon' />
                            <p>{errors.email}</p>
                        </div>
                    </div>
                    <div className='inputGroupAuth'>
                        <div className='passwordLabelsAuth'>
                            <label htmlFor="password" className='passwordLabelAuth'>Contraseña</label>
                        </div>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            placeholder='Contraseña'
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <div className='errorAuth' style={{ display: errors.password === '' ? 'none' : 'flex' }}>
                            <img src={`${import.meta.env.VITE_ASSETS_URL}/exclamationIcon.webp`} alt='exclamationIcon' />
                            <p>{errors.password}</p>
                        </div>
                    </div>
                    <input type="submit" value="INICIAR SESIÓN" className='inputSubmitAuth' />
                </form>
            </div >
        </main >
    );
}