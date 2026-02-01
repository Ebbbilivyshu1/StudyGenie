// Switch between real and mock AI service
require('dotenv').config();

// Try to use real Groq AI first
let aiService;
try {
    const realService = require('./aiService');
    // Check for Groq API key
    if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.startsWith('gsk_')) {
        aiService = realService;
        console.log('🤖 Using Real Groq AI');
    } else {
        throw new Error('No valid Groq API key');
    }
} catch (error) {
    // Fallback to mock service
    aiService = require('./mockAIService');
    console.warn('⚠️  Using Mock AI Service (fake responses)');
    console.warn('   Get a real Groq API key from: https://console.groq.com');
}

module.exports = aiService;
