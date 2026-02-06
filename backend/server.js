require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const studyRoutes = require('./routes/study');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

const connectDB = require('./config/db');

// Connect to Database
connectDB();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/study', studyRoutes);
app.use('/api/history', require('./routes/history'));

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'AI Study Companion API is running',
        database: global.useMongoDb ? 'MongoDB' : 'In-Memory (temporary)',
        timestamp: new Date().toISOString()
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled Server Error:', err);
    res.status(500).json({
        message: 'Something went wrong!',
        // Only return error details in development
        error: process.env.NODE_ENV === 'development' ? err.message : undefined,
        code: err.code || 'INTERNAL_ERROR'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Start server
// Start server
const PORT = process.env.PORT || 8080;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`📚 AI Study Companion Backend v1.0`);
        console.log(`💾 Storage: ${global.useMongoDb ? 'MongoDB' : 'In-Memory (temporary)'}`);
    });
}

module.exports = app;
