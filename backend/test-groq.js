// Test Groq API
require('dotenv').config();
const Groq = require('groq-sdk');

async function testGroqAPI() {
    try {
        console.log('Testing Groq API...');

        if (!process.env.GROQ_API_KEY) {
            throw new Error('GROQ_API_KEY not found in environment variables');
        }
        console.log('API Key present:', process.env.GROQ_API_KEY.substring(0, 10) + '...');

        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

        console.log('Sending request to Groq...');
        const completion = await groq.chat.completions.create({
            messages: [
                { role: 'user', content: 'Say hello in one short sentence.' }
            ],
            model: 'llama-3.3-70b-versatile',
        });

        console.log('✅ Success! Response:', completion.choices[0]?.message?.content);
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testGroqAPI();
