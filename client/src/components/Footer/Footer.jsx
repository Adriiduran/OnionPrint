// Dependencies
import { useState } from "react";
import { Link } from 'react-router-dom';
import { useMediaQuery } from '@mui/material';
import { validateEmail } from "../../utils/UserDataValidation";
import { toast } from 'react-toastify';
import axios from 'axios';

// Style
import "./Footer.css"

export default function Footer() {

    const isMobile = useMediaQuery('(max-width:1110px)');
    const [checkboxIsAccepted, setCheckboxIsAccepted] = useState(false)
    const [checkboxError, setCheckboxError] = useState(false)
    const [email, setEmail] = useState("")
    const [emailError, setEmailError] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault();

        if (email === "" || !validateEmail(email)) {
            setEmailError("Email erroneo")
            return
        } else if (!checkboxIsAccepted) {
            setCheckboxError("Debes aceptar las condiciones")
            return
        }

        setEmailError("")
        setCheckboxError("")

        axios.post("http://localhost:5252/send-discount", { email })
            .then(() => {
                toast.success('Codigo de descuento enviado!', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    theme: 'light',
                });
            })
            .catch(() => {
                toast.error('Ha ocurrido un error al enviar el descuento', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    theme: 'light',
                });
            });
    }

    const handleEmailOnChange = (e) => {
        setEmailError("")
        setEmail(e.target.value)
    }

    const toggleCheckboxValue = () => {
        setCheckboxError("")
        setCheckboxIsAccepted(prevState => !prevState);
    }

    return (
        <footer className="footer">
            <div className="footer-main">
                <div className="footer-main-logo">
                    <img src="/src/assets/logoDarkMode.svg" alt="Onion Print Logo" />
                    <p>Tu imprenta de confianza en un mundo online.</p>
                </div>
                <div className="footer-main-links">
                    <Link className="footer-main-links-link" to="/payment-methods">Formas de pago</Link>
                    <Link className="footer-main-links-link" to="/cookies">Políticas de cookies</Link>
                    <Link className="footer-main-links-link" to="/warranty-returns">Garantias y Devoluciones</Link>
                    <Link className="footer-main-links-link" to="/production-shipment">Metodos de producción y envío</Link>
                </div>
                <div className="footer-main-newsletter">
                    <h2>Boletín</h2>
                    <p>Recibirás un <strong>Bono</strong> de descuento al suscribirte</p>
                    <form onSubmit={handleSubmit}>
                        <input type="email" name="email" id="email" className="footer-main-newsletter-input" placeholder="Email" onChange={(e) => handleEmailOnChange(e)} />
                        <input type="submit" value="Enviar" />
                    </form>
                    {emailError !== "" && (
                        <span>{emailError}!</span>
                    )}
                    <div>
                        <input type="checkbox" name="checkbox" id="checkbox" onClick={toggleCheckboxValue} />
                        <p><strong>Acepto</strong> condiciones generales / política de confidencialidad</p>
                    </div>
                    {checkboxError !== "" && (
                        <span>{checkboxError}</span>
                    )}
                </div>
            </div>
            <div className="footer-secondary">
                <div className="footer-secondary-info">
                    {isMobile ? (
                        <>
                            <p>2004-2024 onionprint.es |</p>
                            <div>
                                <img src="/src/assets/whatsappIcon.svg" alt="Whatsapp Icon" />
                                <p>644012942 ( Lunes a Viernes de 9:00 a 16:00 ) |</p>
                            </div>
                        </>
                    ) : (
                        <>
                            <p>2004-2024 onionprint.es |</p>
                            <img src="/src/assets/whatsappIcon.svg" alt="Whatsapp Icon" />
                            <p>644012942 ( Lunes a Viernes de 9:00 a 16:00 ) |</p>
                        </>

                    )}
                </div>
                <div className="footer-secondary-icons">
                    <img src="/src/assets/googlePayIcon.svg" alt="Google Pay Icon" />
                    <img src="/src/assets/applePayIcon.svg" alt="Apple Pay Icon" />
                    <img src="/src/assets/paypalIcon.svg" alt="PayPal Icon" />
                    <img src="/src/assets/visaIcon.svg" alt="Visa Icon" />
                    <img src="/src/assets/mastercardIcon.svg" alt="Mastercard Icon" />
                </div>
            </div>
        </footer>
    )
}