import { useState } from 'react';
import './Header.css';
import { Link } from 'react-router-dom';

function Header() {
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <header className="header">
            <article className='desktop'>
                <div className="main">
                    <Link to="/">
                        <img src="/src/assets/logo.svg" alt="Logo" className='logo' />
                    </Link>
                    <a href="#" className='delivery'>
                        <p>ENVÍOS A DOMICILIO</p>
                        <img src="/src/assets/deliveryIcon.png" alt="Delivery Icon Button" />
                    </a>
                </div>
                <nav className="elements">
                    <ul>
                        <li><Link to="/register">
                            <span className='button'>
                                <p>REGISTRARSE</p>
                                <img src="/src/assets/registerIcon.png" alt="User Icon Button" />
                            </span>
                        </Link></li>
                        <li><Link to="/login">
                        <span className='button primary'>
                            <p>IDENTIFICARSE</p>
                            <img src="/src/assets/loginIcon.png" alt="User Icon Button" />
                        </span> 
                            </Link></li>
                        <li><span className='button primary'>
                            <img src="/src/assets/cartIcon.png" alt="User Icon Button" />
                            <p>0€</p>
                        </span></li>
                    </ul>
                </nav>
            </article>

            <article className='mobile'>
                <div className="main">
                    <Link to='/'><img src="/src/assets/logo.svg" alt="Logo" className='logo' /></Link>
                    <img className='hamburguerIcon' src={`${isMobileMenuOpen ? '/src/assets/closeIcon.png' : '/src/assets/burgerMenu.png'}`} alt="Hamburguer Menu Button" onClick={toggleMobileMenu} />
                </div>
                <nav className={`${isMobileMenuOpen ? 'elements' : 'mobileMenuClose'}`}>
                    <ul>
                        <li><a href="#" className='delivery'>
                            <p>ENVÍOS A DOMICILIO</p>
                            <img src="/src/assets/deliveryIcon.png" alt="Delivery Icon Button" />
                        </a></li>
                        <li><Link to="/register">
                            <span className='button'>
                                <p>REGISTRARSE</p>
                                <img src="/src/assets/registerIcon.png" alt="User Icon Button" />
                            </span>
                        </Link></li>
                        <li><Link to="/login">
                        <span className='button primary'>
                            <p>IDENTIFICARSE</p>
                            <img src="/src/assets/loginIcon.png" alt="User Icon Button" />
                        </span> 
                            </Link></li>
                        <li><span className='button primary'>
                            <img src="/src/assets/cartIcon.png" alt="User Icon Button" />
                            <p>0€</p>
                        </span></li>
                    </ul>
                </nav>
            </article>
        </header>
    );
}

export default Header;
