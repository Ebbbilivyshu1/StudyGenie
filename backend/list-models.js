// List available Gemini models for this API key
require('dotenv').config();
const axios = require('axios');

const API_KEY = process.env.GEMINI_API_KEY;

async function listModels() {
    try {
        console.log('Checking API key:', API_KEY);
        console.log('\nFetching available models...\n');

        const response = await axios.get(
            `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`
        );

        console.log('✅ Available models:');
        response.data.models.forEach(model => {
            console.log(`  - ${model.name}`);
            console.log(`    Description: ${model.description}`);
            console.log(`    Supported: ${model.supportedGenerationMethods.join(', ')}\n`);
        });

    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
    }
}

listModels();
