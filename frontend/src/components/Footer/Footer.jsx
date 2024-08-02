// Dependencies
import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { useMediaQuery } from '@mui/material';
import { validateEmail } from "../../utils/UserDataValidation";
import { toast } from 'react-toastify';
import axios from 'axios';
import { useLocation } from "react-router-dom";

// Style
import "./Footer.css"

export default function Footer() {

    const isMobile = useMediaQuery('(max-width:1110px)');
    const [checkboxIsAccepted, setCheckboxIsAccepted] = useState(false)
    const [checkboxError, setCheckboxError] = useState(false)
    const [email, setEmail] = useState("")
    const [emailError, setEmailError] = useState("")
    const location = useLocation();
    const [isAdminRoute, setIsAdminRoute] = useState(false)
    

    useEffect(() => {
        setIsAdminRoute(location.pathname.includes('/admin') ? true : false)
    }, [location])

    const handleSubmit = async (e) => {
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

        await axios.post(`${import.meta.env.VITE_API_URL}/send-discount`, { email })
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

    if (!isAdminRoute) {
        return (
            <footer className="footer">
                <div className="footer-main">
                    <div className="footer-main-logo">
                        <img src={`${import.meta.env.VITE_ASSETS_URL}/logo_blanco.svg`} alt="Onion Print Logo" loading="lazy" />
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
                            <input type="email" name="email" id="footerEmail" className="footer-main-newsletter-input" placeholder="Email" onChange={(e) => handleEmailOnChange(e)} />
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
                                <p>© 2004-2024 onionprint.online</p>
                                <div>
                                    <img src={`${import.meta.env.VITE_ASSETS_URL}/whatsappIcon.svg`} alt="Whatsapp Icon" loading="lazy"/>
                                    <p>644012942</p>
                                </div>
                                <p>Lunes a Viernes de 9:00 a 16:00</p>
                            </>
                        ) : (
                            <>
                                <p>© 2004-2024 onionprint.online | </p>
                                <img src={`${import.meta.env.VITE_ASSETS_URL}/whatsappIcon.svg`} alt="Whatsapp Icon" loading="lazy"/>
                                <p>644012942 ( Lunes a Viernes de 9:00 a 16:00 ) |</p>
                            </>
    
                        )}
                    </div>
                    <div className="footer-secondary-icons">
                        <img src={`${import.meta.env.VITE_ASSETS_URL}/googlePayIcon.svg`} alt="Google Pay Icon" loading="lazy"/>
                        <img src={`${import.meta.env.VITE_ASSETS_URL}/applePayIcon.svg`} alt="Apple Pay Icon" loading="lazy"/>
                        <img src={`${import.meta.env.VITE_ASSETS_URL}/paypalIcon.svg`} alt="PayPal Icon" loading="lazy"/>
                        <img src={`${import.meta.env.VITE_ASSETS_URL}/visaIcon.svg`} alt="Visa Icon" loading="lazy"/>
                        <img src={`${import.meta.env.VITE_ASSETS_URL}/mastercardIcon.svg`} alt="Mastercard Icon" loading="lazy"/>
                    </div>
                </div>
            </footer>
        );
    } else {
        return(<></>);
    }
}