import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth APIs
export const authAPI = {
    signup: (data) => api.post('/api/auth/signup', data),
    login: (data) => api.post('/api/auth/login', data),
    forgotPassword: (email) => api.post('/api/auth/forgot-password', { email }),
    resetPassword: (data) => api.post('/api/auth/reset-password', data),
};

// User APIs
export const userAPI = {
    getProfile: () => api.get('/api/user/profile'),
    updateProfile: (data) => api.put('/api/user/profile', data),
    getResults: () => api.get('/api/user/results'),
    saveResult: (data) => api.post('/api/user/results', data),
};

// Study APIs
export const studyAPI = {
    summarize: (content) => api.post('/api/study/summarize', { content }),
    extractKeyPoints: (content) => api.post('/api/study/key-points', { content }),
    generateQuiz: (content, numberOfQuestions = 5) =>
        api.post('/api/study/quiz', { content, numberOfQuestions }),
    generateMindMap: (content) => api.post('/api/study/mind-map', { content }),
    generateFlowchart: (content) => api.post('/api/study/flowchart', { content }),
    chat: (message, conversationHistory, sessionId) =>
        api.post('/api/study/chat', { message, conversationHistory, sessionId }),
    analyzeMultimodal: (formData) =>
        api.post('/api/study/analyze-multimodal', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),
    extractText: (formData) =>
        api.post('/api/study/extract-text', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),
};

// History APIs
export const historyAPI = {
    getSessions: () => api.get('/api/history/sessions'),
    createSession: (title) => api.post('/api/history/sessions', { title }),
    getMessages: (sessionId) => api.get(`/api/history/sessions/${sessionId}/messages`),
    deleteSession: (sessionId) => api.delete(`/api/history/sessions/${sessionId}`),
};

export default api;
