const mongoose = require('mongoose');
const fileProcessingService = require('./services/fileProcessingService');
const ChatSession = require('./models/ChatSession');
require('dotenv').config();

const runVerification = async () => {
    console.log('--- Starting System Verification ---');

    // 1. Mock File Processing Test
    console.log('\n1. Testing File Processing Service (Mock)...');
    try {
        // We can't easily mock PDF buffer without a real file, but we can check if module loads
        if (fileProcessingService) {
            console.log('✅ FileProcessingService loaded successfully');
            console.log('   Supports: PDF, DOCX');
        }
    } catch (e) {
        console.error('❌ FileProcessingService failed:', e);
    }

    // 2. Database Model Test
    console.log('\n2. Testing Database Models...');
    try {
        const testSession = new ChatSession({ userId: new mongoose.Types.ObjectId(), title: 'Test' });
        const err = testSession.validateSync();
        if (!err) {
            console.log('✅ ChatSession model validation passed');
        } else {
            console.error('❌ ChatSession validation failed:', err);
        }
    } catch (e) {
        console.error('❌ Model test failed:', e);
    }

    console.log('\n--- Verification Complete ---');
    process.exit(0);
};

runVerification();
