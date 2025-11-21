import React, { useState, useEffect, useCallback } from 'react';
import ProfileCard from '../components/profiles/ProfileCard';
import { getProfiles, getGames } from '../services/api';
import { FaSearch, FaGamepad, FaSort, FaTrophy, FaTimes } from 'react-icons/fa';
import './Home.css';

const Home = () => {
  const [profiles, setProfiles] = useState([]);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    game: '',
    sortBy: 'rating',
    search: '',
    rank: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  // Загрузка игр для фильтра
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
      } else {
        setLoadingMore(true);
      }

      const profilesData = await getProfiles({
        ...filters,
        page: pageNum,
        page_size: 12
      });

      if (profilesData.length === 0) {
        setHasMore(false);
      } else {
        setProfiles(prev => reset ? profilesData : [...prev, ...profilesData]);
        setPage(pageNum);
      }
    } catch (error) {
      console.error('Ошибка загрузки профилей:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [filters]);

  // Загрузка профилей при изменении фильтров
  useEffect(() => {
    setPage(1);
    setProfiles([]);
    loadProfiles(1, true);
  }, [filters, loadProfiles]);

  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      loadProfiles(page + 1);
    }
  }, [loadingMore, hasMore, page, loadProfiles]);

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

  // Бесконечная прокрутка
  const handleScroll = useCallback(() => {
    if (window.innerHeight + document.documentElement.scrollTop 
        !== document.documentElement.offsetHeight || loadingMore) {
      return;
    }
    handleLoadMore();
  }, [loadingMore, handleLoadMore]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const hasActiveFilters = filters.search || filters.game || filters.rank || filters.sortBy !== 'rating';

  return (
    <div className="home">
      {/* Рекламные баннеры в одну строку */}
      <section className="ad-banners-row">
        <div className="ad-banner large">
          <div className="ad-placeholder">
            <span>Рекламный баннер</span>
            <p>Большой баннер</p>
          </div>
        </div>
        <div className="ad-banner small">
          <div className="ad-placeholder">
            <span>Рекламный баннер</span>
            <p>Малый баннер 1</p>
          </div>
        </div>
        <div className="ad-banner small">
          <div className="ad-placeholder">
            <span>Рекламный баннер</span>
            <p>Малый баннер 2</p>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Найди идеального <span className="accent">игрового партнёра</span>
          </h1>
          <p className="hero-subtitle">
            Присоединяйся к сообществу геймеров, находи единомышленников 
            и монетизируй свой игровой опыт
          </p>
        </div>
      </section>

      {/* Compact Search and Filters Section */}
      <section className="filters-section card">
        <div className="filters-header">
          <div className="search-box compact">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Поиск по нику, игре..."
              value={filters.search}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
          
          <div className="filter-buttons">
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
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="filters-expanded">
            <div className="filters-grid compact">
              <div className="filter-group compact">
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

              <div className="filter-group compact">
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

              <div className="filter-group compact">
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
          <div className="active-filters compact">
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

      {/* Profiles Section */}
      <section className="profiles-section">
        <div className="section-header">
          <h2 className="section-title">
            {filters.search ? `Результаты поиска "${filters.search}"` : 'Игроки для вас'}
          </h2>
          <div className="results-count">
            {profiles.length > 0 && `Найдено: ${profiles.length} игроков`}
          </div>
        </div>
        
        {loading && page === 1 ? (
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Загрузка игроков...</p>
          </div>
        ) : profiles.length === 0 ? (
          <div className="empty-state">
            <h3>Игроки не найдены</h3>
            <p>Попробуйте изменить параметры поиска или фильтры</p>
          </div>
        ) : (
          <>
            <div className="profiles-grid grid grid-3">
              {profiles.map(profile => (
                <ProfileCard key={profile.id} profile={profile} />
              ))}
            </div>

            {/* Пагинация/Загрузка еще */}
            <div className="load-more-section">
              {loadingMore ? (
                <div className="loading-more">
                  <div className="loading-spinner small"></div>
                  <span>Загрузка...</span>
                </div>
              ) : hasMore ? (
                <button 
                  onClick={handleLoadMore}
                  className="btn btn-secondary load-more-btn"
                >
                  Показать еще
                </button>
              ) : profiles.length > 0 && (
                <p className="no-more-results">Все игроки загружены</p>
              )}
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default Home;