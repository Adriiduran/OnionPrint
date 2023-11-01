//Dependencies
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/User";
import { resetPassword } from "../../utils/User";
import 'react-toastify/dist/ReactToastify.css';

//Styles
import './Auth.css';

//Icons
import questionIcon from '../../assets/questionIcon.png';
import exclamationIcon from '../../assets/exclamationIcon.png';

export default function ForgotPassword() {

    const navigator = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
    });

    const [errors, setErrors] = useState({
        email: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Realizar validaciones antes de enviar los datos.
        const emailError = formData.email === "" ? "Este campo no puede estar vacío" : validateEmail(formData.email);

        setErrors({
            email: emailError,
        });

        // Si no hay errores, puedes enviar los datos al servidor aquí.
        if (!emailError) {
            console.log('Datos válidos, enviando formulario...');
            try {
                await resetPassword(formData.email, navigator);
            } catch (error) {
                setErrors({
                    email: error.message
                });
                console.log("Reset Password: " + error.message);
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
                        <img src={questionIcon} alt="Imagen del título de la página de registro" />
                    </span>
                    <h1>Recuperar Contraseña</h1>
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
                    <input type="submit" value="RECUPERAR CONTRASEÑA" className='inputSubmit' />
                </form>
            </div>
        </main>
    );
}