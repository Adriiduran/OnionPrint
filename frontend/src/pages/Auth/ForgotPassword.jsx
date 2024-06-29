//Dependencies
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/UserDataValidation";
import 'react-toastify/dist/ReactToastify.css';
import Loader from "../../components/Loader/Loader";
import { useAuth } from '../../auth/AuthContext'

//Styles
import './Auth.css';

export default function ForgotPassword() {

    const navigator = useNavigate();
    const { resetPassword, user } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
    });

    const [errors, setErrors] = useState({
        email: '',
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user && user.email !== '') {
            navigator('/')
        }
    }, [user])

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Realizar validaciones antes de enviar los datos.
        const emailError = formData.email === "" ? "Este campo no puede estar vacío" : validateEmail(formData.email);

        setErrors({
            email: emailError,
        });

        // Si no hay errores, puedes enviar los datos al servidor aquí.
        if (emailError && emailError !== 'Este campo no puede estar vacío') {
            setLoading(true)
            try {
                await resetPassword(formData.email, navigator);
            } catch (error) {
                setErrors({
                    email: error.message
                });
            } finally {
                setLoading(false)
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
                        <img src={`${import.meta.env.VITE_ASSETS_URL}/exclamationIcon.png`} alt="Imagen del título de la página de registro" />
                    </span>
                    <h1>Recuperar Contraseña</h1>
                </div>

                <form onSubmit={handleSubmit} className="formAuth">
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
                    <input type="submit" value="RECUPERAR CONTRASEÑA" className='inputSubmitAuth' />
                </form>
            </div>

            {loading && <Loader />}
        </main>
    );
}