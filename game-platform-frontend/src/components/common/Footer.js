import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">E-PAL Arcade</h3>
            <p className="footer-description">
              Платформа для поиска игровых партнёров и монетизации игрового опыта
            </p>
          </div>
          
          <div className="footer-section">
            <div className="support-section">
              <span className="support-label">Контакты</span>
              <a href="mailto:support@epal-arcade.ru" className="support-link">
                support@epal-arcade.ru
              </a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2024 E-PAL Arcade. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;