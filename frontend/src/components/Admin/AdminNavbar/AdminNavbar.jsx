import { useState } from 'react';
import { useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import './AdminNavbar.css';

export default function AdminNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width:768px)');
  const navigator = useNavigate();
  
 
  const handleClick = (navigatorString) => {
    navigator(navigatorString);
  };

  return (
    <aside className='aside'> 
      <div className='aside-logo'>
        <img src={`${import.meta.env.VITE_ASSETS_URL}/logo_blanco.svg`} alt="OnionPrint Logo" className='logo' />
        {isMobile && (
          <img src={`${import.meta.env.VITE_ASSETS_URL}/burgerIconWhite.webp`} alt="Burger Menu Icon" className='burgerMenu' onClick={() => { setIsMobileMenuOpen(!isMobileMenuOpen) }} />
        )}
      </div>
      {(isMobileMenuOpen || !isMobile) && (
        <div className='aside-items'>
          <ul className='aside-items-list'>
            <li className='aside-items-list-item' onClick={() => { handleClick('/admin/home') }}>
              <img src={`${import.meta.env.VITE_ASSETS_URL}/homeIcon.webp`} alt="Home image" />
              <p>Inicio</p>
            </li>
            <li className='aside-items-list-item' onClick={() => { handleClick('/admin/users') }}>
              <img src={`${import.meta.env.VITE_ASSETS_URL}/profileIcon.webp`} alt="Users image" />
              <p>Usuarios</p>
            </li>
            <li className='aside-items-list-item' onClick={() => { handleClick('/admin/orders') }}>
              <img src={`${import.meta.env.VITE_ASSETS_URL}/orderIcon.webp`} alt="Orders image" />
              <p>Pedidos</p>
            </li>
            <li className='aside-items-list-item' onClick={() => { handleClick('/admin/discounts') }}>
              <img src={`${import.meta.env.VITE_ASSETS_URL}/discountIcon.webp`} alt="Discount image" />
              <p>Cupones</p>
            </li>
          </ul>
        </div>
      )}
    </aside>
  );
}
