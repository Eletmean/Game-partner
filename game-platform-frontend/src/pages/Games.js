import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getGames } from '../services/api';
import './Games.css';

const Games = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    try {
      setLoading(true);
      const gamesData = await getGames();
      setGames(gamesData);
    } catch (error) {
      console.error('Ошибка загрузки игр:', error);
    } finally {
      setLoading(false);
    }
  };

  // Фильтрация игр по поиску
  const filteredGames = games.filter(game =>
    game.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="games-page">
      {/* Заголовок и поиск */}
      <section className="games-header">
        <div className="games-header-content">
          <div className="games-header-left">
            <h1 className="games-title">Игры</h1>
            <p className="games-subtitle">
              Выберите игру, чтобы найти партнеров для совместной игры
            </p>
          </div>
          
          <div className="games-search">
            <input
              type="text"
              placeholder="Поиск игр..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="games-search-input"
            />
          </div>
        </div>
      </section>

      {/* Сетка игр */}
      <section className="games-section">
        {loading ? (
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Загрузка игр...</p>
          </div>
        ) : filteredGames.length === 0 ? (
          <div className="empty-state">
            <h3>Игры не найдены</h3>
            <p>Попробуйте изменить поисковый запрос</p>
          </div>
        ) : (
          <>
            <div className="games-stats">
              <span>Найдено игр: {filteredGames.length}</span>
            </div>
            
            <div className="games-grid">
              {filteredGames.map(game => (
                <GameCard key={game.game_id} game={game} />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
};

// Компонент карточки игры
const GameCard = ({ game }) => {
  return (
    <div className="game-card">
      <div className="game-image-container">
        {game.icon_url ? (
          <img 
            src={game.icon_url} 
            alt={game.name}
            className="game-image"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x200/6c63ff/ffffff?text=Игра';
            }}
          />
        ) : (
          <div className="game-image-placeholder">
            <span>{game.name.charAt(0)}</span>
          </div>
        )}
      </div>
      
      <div className="game-content">
        <h3 className="game-name">{game.name}</h3>
        
        {game.description && (
          <p className="game-description">
            {game.description.length > 80 
              ? `${game.description.substring(0, 80)}...` 
              : game.description
            }
          </p>
        )}
        
        <div className="game-actions">
          <Link 
            to={`/profiles?game=${game.game_id}`} 
            className="btn btn-primary game-action-btn"
          >
            Найти игроков
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Games;