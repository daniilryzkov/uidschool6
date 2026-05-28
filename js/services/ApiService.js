class ApiService {
    constructor() {
        // Автоопределение URL: локально или на хостинге
        this.baseURL = this.getBaseURL();
        this.token = localStorage.getItem('token');
    }

    getBaseURL() {
        // Если запущено с localhost или 127.0.0.1 — локальный сервер
        const host = window.location.hostname;
        const port = window.location.port;

        if (host === 'localhost' || host === '127.0.0.1') {
            return 'http://localhost:5000/api';
        }

        // На хостинге: фронт и бэк на одном сервере
        // или бэк на поддомене
        return '/api'; // Если бэк на том же сервере
        // return 'https://api.вашсайт.ру'; // Если бэк на поддомене
    }

    setToken(token) {
        this.token = token;
        if (token) localStorage.setItem('token', token);
    }

    clearToken() {
        this.token = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        console.log('API запрос:', url);

        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const response = await fetch(url, { ...options, headers });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Ошибка запроса');
        }

        return data;
    }

    async register(name, email, password) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password })
        });
    }

    async login(email, password) {
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
    }

    async getProfile() {
        return this.request('/auth/profile');
    }

    async saveTestResult(category, score, total) {
        return this.request('/quiz/result', {
            method: 'POST',
            body: JSON.stringify({ 
                category, 
                score, 
                totalQuestions: total 
            })
        });
    }

    async getTestHistory() {
        return this.request('/quiz/history');
    }
}