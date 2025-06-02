import { useState, useEffect } from 'react';
import './Header.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext'

//Context
import { useShoppingCart } from '../../context/ShoppingCartContext';

function Header() {
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user, logout, isAdmin } = useAuth();
    const { finalShoppingCartPreferences } = useShoppingCart();
    const navigator = useNavigate();
    const location = useLocation();
    const [isAdminRoute, setIsAdminRoute] = useState(false)


    const toggleMobileMenu = () => {
        setMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleLogout = () => {
        setMobileMenuOpen(false)
        logout(navigator)
    }

    useEffect(() => {
        setIsAdminRoute(location.pathname.includes('/admin') ? true : false)
    }, [location])

    if (!isAdminRoute) {
        return (
            <header className="headerHeader">
                <article className='desktopHeader'>
                    <div className="mainHeader">
                        <Link to="/">
                            <img src={`${import.meta.env.VITE_ASSETS_URL}/logo_negro.svg`} alt="Logo" className='logoHeader' />
                        </Link>
                    </div>
                    <nav className="elementsHeader">
                        <ul>
                            <li style={{ display: user ? 'none' : 'block' }}><Link to="/register">
                                <span className='buttonHeader'>
                                    <p>REGISTRARSE</p>
                                    <img src={`${import.meta.env.VITE_ASSETS_URL}/registerIcon.webp`} alt="User Icon Button" />
                                </span>
                            </Link></li>
                            <li style={{ display: user ? 'none' : 'block' }}><Link to="/login">
                                <span className='buttonHeader primaryHeader'>
                                    <p>IDENTIFICARSE</p>
                                    <img src={`${import.meta.env.VITE_ASSETS_URL}/loginIcon.webp`} alt="User Icon Button" />
                                </span>
                            </Link></li>
                            {isAdmin && (
                                <li style={{ display: 'block' }}>
                                    <Link to="/admin/home">
                                        <span className="buttonHeader primaryHeader">
                                            <p>ADMIN</p>
                                            <img
                                                src={`${import.meta.env.VITE_ASSETS_URL}/profileIcon.webp`}
                                                alt="Admin Icon"
                                            />
                                        </span>
                                    </Link>
                                </li>
                            )}
                            <li style={{ display: user ? 'block' : 'none' }} onClick={() => { logout(navigator) }}>
                                <span className='buttonHeader logoutHeader'>
                                    <p>CERRAR SESIÓN</p>
                                    <img src={`${import.meta.env.VITE_ASSETS_URL}/loginIcon.webp`} alt="User Icon Button" />
                                </span></li>
                            <li><Link to="/cart">
                                <span className='buttonHeader primaryHeader'>
                                    <img src={`${import.meta.env.VITE_ASSETS_URL}/cartIcon.webp`} alt="User Icon Button" />
                                    <p>{finalShoppingCartPreferences.items.length !== undefined ? finalShoppingCartPreferences.items.length : 0}</p>
                                </span>
                            </Link></li>
                        </ul>
                    </nav>
                </article>

                <article className='mobileHeader'>
                    <div className="mainHeader">
                        <Link to='/' onClick={() => { setMobileMenuOpen(false) }}><img src={`${import.meta.env.VITE_ASSETS_URL}/logo.svg`} alt="Logo" className='logoHeader' /></Link>
                        <img className='hamburguerIconHeader' src={`${isMobileMenuOpen ? `${import.meta.env.VITE_ASSETS_URL}/closeIcon.webp` : `${import.meta.env.VITE_ASSETS_URL}/burgerMenu.webp`}`} alt="Hamburguer Menu Button" onClick={toggleMobileMenu} />
                    </div>
                    <nav className={`${isMobileMenuOpen ? 'elementsHeader' : 'mobileMenuCloseHeader'}`}>
                        <ul>
                            <li style={{ display: user ? 'none' : 'block' }}><Link to="/register" onClick={() => { setMobileMenuOpen(false) }}>
                                <span className='buttonHeader'>
                                    <p>REGISTRARSE</p>
                                    <img src={`${import.meta.env.VITE_ASSETS_URL}/registerIcon.webp`} alt="User Icon Button" />
                                </span>
                            </Link></li>
                            <li style={{ display: user ? 'none' : 'block' }}><Link to="/login" onClick={() => { setMobileMenuOpen(false) }}>
                                <span className='buttonHeader primaryHeader'>
                                    <p>IDENTIFICARSE</p>
                                    <img src={`${import.meta.env.VITE_ASSETS_URL}/loginIcon.webp`} alt="User Icon Button" />
                                </span>
                            </Link></li>
                            <li style={{ display: user ? 'block' : 'none' }}>
                                <Link to={isAdmin && "/admin/home"}>
                                    <span className='buttonHeader primaryHeader'>
                                        <p>{isAdmin ? ("ADMIN") : ("PERFIL")}</p>
                                        <img src={`${import.meta.env.VITE_ASSETS_URL}/profileIcon.webp`} alt="User Icon Button" />
                                    </span>
                                </Link>
                            </li>
                            <li style={{ display: user ? 'block' : 'none' }} onClick={handleLogout}>
                                <span className='buttonHeader logoutHeader'>
                                    <p>CERRAR SESIÓN</p>
                                    <img src={`${import.meta.env.VITE_ASSETS_URL}/loginIcon.webp`} alt="User Icon Button" />
                                </span></li>
                            <li><Link to="/cart">
                                <span className='buttonHeader primaryHeader'>
                                    <img src={`${import.meta.env.VITE_ASSETS_URL}/cartIcon.webp`} alt="User Icon Button" />
                                    <p>{finalShoppingCartPreferences.items.length !== undefined ? finalShoppingCartPreferences.items.length : 0}</p>
                                </span>
                            </Link></li>
                        </ul>
                    </nav>
                </article>
            </header>
        )
    } else {
        return (<></>);
    }
}

export default Header;
