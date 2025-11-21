import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Profiles
export const getProfiles = async (filters = {}) => {
  try {
    const response = await api.get('/profiles/', { 
      params: {
        page: filters.page || 1,
        page_size: filters.page_size || 12,
        game: filters.game,
        sort_by: filters.sortBy,
        search: filters.search,
        rank: filters.rank,
        has_achievements: filters.achievements
      }
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка загрузки профилей:', error);
    return [];
  }
};

export const getProfile = async (id) => {
  try {
    const response = await api.get(`/profiles/${id}/`);
    return response.data;
  } catch (error) {
    console.error('Ошибка загрузки профиля:', error);
    return null;
  }
};

// Games
export const getGames = async () => {
  try {
    const response = await api.get('/games/');
    return response.data;
  } catch (error) {
    console.error('Ошибка загрузки игр:', error);
    return [];
  }
};

// Posts
export const getPosts = async (userId) => {
  try {
    const response = await api.get('/posts/', { 
      params: { author: userId } 
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка загрузки постов:', error);
    return [];
  }
};

export const createPost = async (postData) => {
  try {
    const response = await api.post('/posts/', postData);
    return response.data;
  } catch (error) {
    console.error('Ошибка создания поста:', error);
    throw error;
  }
};

export const updatePost = async (id, postData) => {
  try {
    const response = await api.put(`/posts/${id}/`, postData);
    return response.data;
  } catch (error) {
    console.error('Ошибка обновления поста:', error);
    throw error;
  }
};

export const deletePost = async (id) => {
  try {
    const response = await api.delete(`/posts/${id}/`);
    return response.data;
  } catch (error) {
    console.error('Ошибка удаления поста:', error);
    throw error;
  }
};

// Subscriptions
export const getSubscriptionPlans = async (userId) => {
  try {
    const response = await api.get('/subscription-plans/', {
      params: { author: userId }
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка загрузки планов подписки:', error);
    return [];
  }
};

// User Games
export const getUserGames = async (userId) => {
  try {
    const response = await api.get('/user-games/', {
      params: { user: userId }
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка загрузки игр пользователя:', error);
    return [];
  }
};

export default api;