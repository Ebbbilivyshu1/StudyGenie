// Quick test of the new AI service
require('dotenv').config();
const aiService = require('./services/aiService');

async function testAllFeatures() {
    console.log('\n Testing AI Features...\n');

    const testContent = "Artificial Intelligence is transforming technology. Machine learning enables computers to learn from data.";

    try {
        // Test 1: Summarizer
        console.log('  Testing Summarizer...');
        const summary = await aiService.summarize(testContent);
        console.log('✅ Summary:', summary.substring(0, 100) + '...\n');

        // Test 2: Key Points
        console.log(' Testing Key Points...');
        const keyPoints = await aiService.extractKeyPoints(testContent);
        console.log('✅ Key Points:', keyPoints.substring(0, 100) + '...\n');

        // Test 3: Quiz
        console.log('  Testing Quiz Generator...');
        const quiz = await aiService.generateQuiz(testContent, 2);
        console.log('✅ Quiz questions:', quiz.questions?.length || 0, 'questions generated\n');

        // Test 4: Chat
        console.log('  Testing Chat Bot...');
        const chatResponse = await aiService.chat("What is AI?");
        console.log('✅ Chat response:', chatResponse.substring(0, 100) + '...\n');

        console.log('🎉 ALL TESTS PASSED! AI features are working!\n');
        process.exit(0);
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        process.exit(1);
    }
}

testAllFeatures();
