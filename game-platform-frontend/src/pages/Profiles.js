import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import ProfileCard from '../components/profiles/ProfileCard';
import { getProfiles, getGames } from '../services/api';
import { FaSearch, FaGamepad, FaSort, FaTrophy, FaTimes } from 'react-icons/fa';
import './Profiles.css';

const Profiles = () => {
  const [profiles, setProfiles] = useState([]);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    game: '',
    sortBy: 'rating',
    search: '',
    rank: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  const PROFILES_PER_PAGE = 15; 

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    try {
      const gamesData = await getGames();
      setGames(gamesData);
    } catch (error) {
      console.error('Ошибка загрузки игр:', error);
    }
  };

  const loadProfiles = useCallback(async (pageNum = 1, reset = false) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      }

      const profilesData = await getProfiles({
        ...filters,
        page: pageNum,
        page_size: PROFILES_PER_PAGE
      });

      if (profilesData.length < PROFILES_PER_PAGE) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

      if (reset) {
        setProfiles(profilesData);
      } else {
        setProfiles(prev => [...prev, ...profilesData]);
      }
      setPage(pageNum);
    } catch (error) {
      console.error('Ошибка загрузки профилей:', error);
    } finally {
      setLoading(false);
    }
  }, [filters, PROFILES_PER_PAGE]);

  // Загрузка профилей при изменении фильтров
  useEffect(() => {
    setPage(1);
    setProfiles([]);
    setHasMore(true);
    loadProfiles(1, true);
  }, [filters, loadProfiles]);

  const handleLoadMore = () => {
    if (hasMore) {
      loadProfiles(page + 1, false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSearchChange = (e) => {
    handleFilterChange('search', e.target.value);
  };

  const clearAllFilters = () => {
    setFilters({
      game: '',
      sortBy: 'rating',
      search: '',
      rank: ''
    });
  };

  const hasActiveFilters = filters.search || filters.game || filters.rank || filters.sortBy !== 'rating';

  return (
    <div className="profiles-page">
      {/* Заголовок и поиск */}
      <section className="profiles-header">
        <div className="profiles-header-content">
          <div className="profiles-header-left">
            <h1 className="profiles-title">Партнеры</h1>
            <p className="profiles-subtitle">
              Найдите идеального игрового партнера для совместных игр
            </p>
          </div>
          
          <div className="profiles-search">
            <FaSearch className="profiles-search-icon" />
            <input
              type="text"
              placeholder="Поиск по нику, игре..."
              value={filters.search}
              onChange={handleSearchChange}
              className="profiles-search-input"
            />
          </div>
        </div>
      </section>

      {/* Фильтры */}
      <section className="profiles-filters card">
        <div className="filters-main">
          <button 
            className={`filter-toggle ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaSort />
            Фильтры
            {hasActiveFilters && <span className="filter-badge"></span>}
          </button>
          
          {hasActiveFilters && (
            <button className="clear-filters" onClick={clearAllFilters}>
              <FaTimes />
              Сбросить
            </button>
          )}
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="filters-expanded">
            <div className="filters-grid">
              <div className="filter-group">
                <FaGamepad className="filter-icon" />
                <select 
                  value={filters.game}
                  onChange={(e) => handleFilterChange('game', e.target.value)}
                  className="filter-select"
                >
                  <option value="">Все игры</option>
                  {games.map(game => (
                    <option key={game.game_id} value={game.game_id}>
                      {game.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <FaSort className="filter-icon" />
                <select 
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="filter-select"
                >
                  <option value="rating">По рейтингу</option>
                  <option value="rank">По рангу</option>
                  <option value="playtime">По времени в игре</option>
                  <option value="followers">По подписчикам</option>
                  <option value="newest">Сначала новые</option>
                </select>
              </div>

              <div className="filter-group">
                <FaTrophy className="filter-icon" />
                <select 
                  value={filters.rank}
                  onChange={(e) => handleFilterChange('rank', e.target.value)}
                  className="filter-select"
                >
                  <option value="">Любой ранг</option>
                  <option value="beginner">Начинающий</option>
                  <option value="intermediate">Средний</option>
                  <option value="advanced">Продвинутый</option>
                  <option value="expert">Эксперт</option>
                  <option value="pro">Профессионал</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="active-filters">
            {filters.search && (
              <span className="active-filter">
                Поиск: "{filters.search}"
                <button onClick={() => handleFilterChange('search', '')}>×</button>
              </span>
            )}
            {filters.game && (
              <span className="active-filter">
                Игра: {games.find(g => g.game_id === parseInt(filters.game))?.name}
                <button onClick={() => handleFilterChange('game', '')}>×</button>
              </span>
            )}
            {filters.rank && (
              <span className="active-filter">
                Ранг: {filters.rank}
                <button onClick={() => handleFilterChange('rank', '')}>×</button>
              </span>
            )}
            {filters.sortBy !== 'rating' && (
              <span className="active-filter">
                Сортировка: {
                  filters.sortBy === 'rank' ? 'По рангу' :
                  filters.sortBy === 'playtime' ? 'По времени в игре' :
                  filters.sortBy === 'followers' ? 'По подписчикам' :
                  filters.sortBy === 'newest' ? 'Сначала новые' :
                  filters.sortBy
                }
                <button onClick={() => handleFilterChange('sortBy', 'rating')}>×</button>
              </span>
            )}
          </div>
        )}
      </section>

      {/* Сетка профилей */}
      <section className="profiles-section">
        <div className="profiles-stats">
          <span>Найдено партнеров: {profiles.length}</span>
          {profiles.length > 0 && hasMore && (
            <span className="profiles-more-info">Показано: {profiles.length}</span>
          )}
        </div>
        
        {loading && page === 1 ? (
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Загрузка партнеров...</p>
          </div>
        ) : profiles.length === 0 ? (
          <div className="empty-state">
            <h3>Партнеры не найдены</h3>
            <p>Попробуйте изменить параметры поиска или фильтры</p>
          </div>
        ) : (
          <>
            <div className="profiles-grid">
              {profiles.map(profile => (
                <ProfileCard key={profile.user.id} profile={profile} />
              ))}
            </div>

            {/* Кнопка "Показать еще" */}
            {hasMore && (
              <div className="load-more-section">
                <button 
                  onClick={handleLoadMore}
                  className="btn btn-primary load-more-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="loading-spinner small"></div>
                      Загрузка...
                    </>
                  ) : (
                    `Показать еще ${PROFILES_PER_PAGE} партнеров`
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default Profiles;