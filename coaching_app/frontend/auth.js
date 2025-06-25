import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/auth/';

// Add an axios interceptor to handle token expiration
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Clear token and redirect to login if unauthorized
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Helper function to get auth header
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const register = async (email, username, password, password2) => {
    try {
        const response = await axios.post(API_URL + 'register/', {
            email,
            username,
            password,
            password2
        });
        if (response.data.access) {
            localStorage.setItem('token', response.data.access);
        }
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw error.response.data;
        } else {
            throw { message: 'Network error. Please try again later.' };
        }
    }
};

export const login = async (email, password) => {
    try {
        const response = await axios.post(API_URL + 'login/', {
            email,
            password
        });
        if (response.data.access) {
            localStorage.setItem('token', response.data.access);
            
            // Store user info if available
            if (response.data.user) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
        }
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw error.response.data;
        } else {
            throw { message: 'Network error. Please try again later.' };
        }
    }
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Optional: Make a logout API call to invalidate the token on the server
};

export const isAuthenticated = () => {
    return !!localStorage.getItem('token');
};

export const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
};