import api from './api';


export const loginUser = async (credentials) => {
  // Временная заглушка
  return {
    user: {
      id: 1,
      username: credentials.username,
      email: credentials.email,
      avatar_url: null
    },
    token: 'fake-jwt-token'
  };
};

export const registerUser = async (userData) => {
  // Временная заглушка
  return {
    user: {
      id: 1,
      username: userData.username,
      email: userData.email,
      avatar_url: null
    },
    token: 'fake-jwt-token'
  };
};

export const getCurrentUser = async () => {
  // Временная заглушка
  const token = localStorage.getItem('token');
  if (token) {
    return {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      avatar_url: null
    };
  }
  throw new Error('Not authenticated');
};