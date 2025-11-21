import React from 'react';
import { Link } from 'react-router-dom';
//import './ProfileCard.css';

const ProfileCard = ({ profile }) => {
  const primaryGame = profile.user_games?.find(game => game.is_primary) || profile.user_games?.[0];
  
  return (
    <div className="profile-card card">
      <div className="profile-header">
        <img 
          src={profile.user.avatar_url || '/default-avatar.png'} 
          alt={profile.user.username}
          className="profile-avatar"
        />
        <div className="profile-info">
          <h3 className="profile-username">{profile.user.username}</h3>
          {primaryGame && (
            <p className="profile-rank">
              {primaryGame.current_rank} • {primaryGame.playtime_hours}ч
            </p>
          )}
          <div className="profile-stats">
            <span className="stat">👥 {profile.followers_count || 0}</span>
            <span className="stat">⭐ {profile.rating || 0}</span>
            {profile.achievements_count > 0 && (
              <span className="stat">🏆 {profile.achievements_count}</span>
            )}
          </div>
        </div>
      </div>

      <div className="profile-games">
        {profile.user_games?.slice(0, 3).map(userGame => (
          <span key={userGame.user_game_id} className="game-tag">
            {userGame.game.name}
          </span>
        ))}
        {profile.user_games?.length > 3 && (
          <span className="game-tag more">+{profile.user_games.length - 3}</span>
        )}
      </div>

      {profile.user.bio && (
        <p className="profile-bio">
          {profile.user.bio.length > 100 
            ? `${profile.user.bio.substring(0, 100)}...` 
            : profile.user.bio
          }
        </p>
      )}

      <div className="profile-actions">
        <Link to={`/profile/${profile.user.id}`} className="btn btn-primary">
          Профиль
        </Link>
        <button className="btn btn-secondary">
          Подписаться
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;