import { useState } from 'react';
import './Header.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext'

//Context
import { useShoppingCart } from '../../context/ShoppingCartContext';

function Header() {
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user, logout } = useAuth();
    const { finalShoppingCartPreferences } = useShoppingCart();

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <header className="headerHeader">
            <article className='desktopHeader'>
                <div className="mainHeader">
                    <Link to="/">
                        <img src="/src/assets/logo.svg" alt="Logo" className='logoHeader' />
                    </Link>
                </div>
                <nav className="elementsHeader">
                    <ul>
                        <li style={{ display: user ? 'none' : 'block' }}><Link to="/register">
                            <span className='buttonHeader'>
                                <p>REGISTRARSE</p>
                                <img src="/src/assets/registerIcon.png" alt="User Icon Button" />
                            </span>
                        </Link></li>
                        <li style={{ display: user ? 'none' : 'block' }}><Link to="/login">
                            <span className='buttonHeader primaryHeader'>
                                <p>IDENTIFICARSE</p>
                                <img src="/src/assets/loginIcon.png" alt="User Icon Button" />
                            </span>
                        </Link></li>
                        <li style={{ display: user ? 'block' : 'none' }}>
                            <span className='buttonHeader primaryHeader'>
                                <p>PERFIL</p>
                                <img src="/src/assets/profileIcon.png" alt="User Icon Button" />
                            </span>
                        </li>
                        <li style={{ display: user ? 'block' : 'none' }} onClick={logout}>
                            <span className='buttonHeader logoutHeader'>
                                <p>CERRAR SESIÓN</p>
                                <img src="/src/assets/loginIcon.png" alt="User Icon Button" />
                            </span></li>
                        <li><Link to="/cart">
                            <span className='buttonHeader primaryHeader'>
                                <img src="/src/assets/cartIcon.png" alt="User Icon Button" />
                                <p>{finalShoppingCartPreferences.items.length !== undefined ? finalShoppingCartPreferences.items.length : 0}</p>
                            </span>
                        </Link></li>
                    </ul>
                </nav>
            </article>

            <article className='mobileHeader'>
                <div className="mainHeader">
                    <Link to='/'><img src="/src/assets/logo.svg" alt="Logo" className='logoHeader' /></Link>
                    <img className='hamburguerIconHeader' src={`${isMobileMenuOpen ? '/src/assets/closeIcon.png' : '/src/assets/burgerMenu.png'}`} alt="Hamburguer Menu Button" onClick={toggleMobileMenu} />
                </div>
                <nav className={`${isMobileMenuOpen ? 'elementsHeader' : 'mobileMenuCloseHeader'}`}>
                    <ul>
                        <li style={{ display: user ? 'none' : 'block' }}><Link to="/register">
                            <span className='buttonHeader'>
                                <p>REGISTRARSE</p>
                                <img src="/src/assets/registerIcon.png" alt="User Icon Button" />
                            </span>
                        </Link></li>
                        <li style={{ display: user ? 'none' : 'block' }}><Link to="/login">
                            <span className='buttonHeader primaryHeader'>
                                <p>IDENTIFICARSE</p>
                                <img src="/src/assets/loginIcon.png" alt="User Icon Button" />
                            </span>
                        </Link></li>
                        <li style={{ display: user ? 'block' : 'none' }}>
                            <span className='buttonHeader primaryHeader'>
                                <p>PERFIL</p>
                                <img src="/src/assets/profileIcon.png" alt="User Icon Button" />
                            </span>
                        </li>
                        <li style={{ display: user ? 'block' : 'none' }} onClick={logout}>
                            <span className='buttonHeader logoutHeader'>
                                <p>CERRAR SESIÓN</p>
                                <img src="/src/assets/loginIcon.png" alt="User Icon Button" />
                            </span></li>
                        <li><Link to="/cart">
                            <span className='buttonHeader primaryHeader'>
                                <img src="/src/assets/cartIcon.png" alt="User Icon Button" />
                                <p>{finalShoppingCartPreferences.items.length !== undefined ? finalShoppingCartPreferences.items.length : 0}</p>
                            </span>
                        </Link></li>
                    </ul>
                </nav>
            </article>
        </header>
    );
}

export default Header;
