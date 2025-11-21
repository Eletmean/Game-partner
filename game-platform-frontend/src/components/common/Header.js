import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <span className="logo-accent">E-PAL</span>
          <span className="logo-text">Arcade</span>
        </Link>
        
        <nav className="nav">
          <Link to="/games" className="nav-link">Игры</Link>
          <Link to="/profiles" className="nav-link">Партнеры</Link>
          <Link to="/messages" className="nav-link">Мессенджер</Link>
          {user && (
            <Link to="/subscriptions" className="nav-link">Подписки</Link>
          )}
        </nav>

        <div className="header-actions">
          {user ? (
            <div className="user-menu">
              <Link to={`/profile/${user.id}`} className="user-info">
                <img 
                  src={user.avatar_url || '/default-avatar.png'} 
                  alt="Avatar" 
                  className="avatar"
                />
                <span>{user.username}</span>
              </Link>
              <button onClick={handleLogout} className="btn btn-secondary">
                Выйти
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-secondary">Войти</Link>
              <Link to="/register" className="btn btn-primary">Регистрация</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;