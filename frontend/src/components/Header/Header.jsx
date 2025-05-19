import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('auth_token');
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    navigate('/login');
    setMenuOpen(false);
  };

  const handleToggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <div className="header">
      <div className="logo">
        🎥 <span>MovieZone</span>
      </div>

      <div 
        className={`burger ${menuOpen ? 'open' : ''}`}
        onClick={handleToggleMenu}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div className={`nav ${menuOpen ? 'open' : ''}`}>
        <Link 
          to="/" 
          className={`nav-item ${isActive('/') ? 'active' : ''}`}
          onClick={handleLinkClick}
        >
          Главная
        </Link>

        <Link 
          to="/library" 
          className={`nav-item ${isActive('/library') ? 'active' : ''}`}
          onClick={handleLinkClick}
        >
          Библиотека
        </Link>

        {isLoggedIn ? (
          <>
            <Link 
              to="/watchlog" 
              className={`nav-item ${isActive('/watchlog') ? 'active' : ''}`}
              onClick={handleLinkClick}
            >
              Дневник просмотра
            </Link>

            <div 
              className="nav-item logout"
              onClick={handleLogout}
            >
              Выйти
            </div>
          </>
        ) : (
          <>
            <Link 
              to="/login" 
              className={`nav-item ${isActive('/login') ? 'active' : ''}`}
              onClick={handleLinkClick}
            >
              Войти
            </Link>

            <Link 
              to="/register" 
              className={`nav-item ${isActive('/register') ? 'active' : ''}`}
              onClick={handleLinkClick}
            >
              Зарегистрироваться
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
