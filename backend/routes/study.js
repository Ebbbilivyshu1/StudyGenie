const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const aiService = require('../services/aiService');
const upload = require('../middleware/upload');
const fileProcessingService = require('../services/fileProcessingService');

// Helper to get content from body or file
const getContent = async (req) => {
    if (req.file) {
        return await fileProcessingService.extractText(req.file);
    }
    return req.body.content;
};

// Summarize endpoint
router.post('/summarize', authMiddleware, upload.single('file'), async (req, res) => {
    try {
        const content = await getContent(req);

        if (!content || content.trim().length < 50) {
            return res.status(400).json({ message: 'Content must be at least 50 characters (text or file)' });
        }

        const summary = await aiService.summarize(content);
        res.json({ summary });
    } catch (error) {
        console.error('Summarize error:', error);
        res.status(500).json({ message: 'Failed to generate summary', error: error.message });
    }
});

// Extract key points endpoint
router.post('/key-points', authMiddleware, upload.single('file'), async (req, res) => {
    try {
        const content = await getContent(req);

        if (!content || content.trim().length < 50) {
            return res.status(400).json({ message: 'Content must be at least 50 characters (text or file)' });
        }

        const keyPoints = await aiService.extractKeyPoints(content);
        res.json({ keyPoints });
    } catch (error) {
        console.error('Key points error:', error);
        res.status(500).json({ message: 'Failed to extract key points', error: error.message });
    }
});

// Generate quiz endpoint
router.post('/quiz', authMiddleware, upload.single('file'), async (req, res) => {
    try {
        const content = await getContent(req);
        const { numberOfQuestions = 5 } = req.body;

        if (!content || content.trim().length < 50) {
            return res.status(400).json({ message: 'Content must be at least 50 characters (text or file)' });
        }

        const quiz = await aiService.generateQuiz(content, numberOfQuestions);
        res.json(quiz);
    } catch (error) {
        console.error('Quiz generation error:', error);
        res.status(500).json({ message: 'Failed to generate quiz', error: error.message });
    }
});

// Generate mind map endpoint
router.post('/mind-map', authMiddleware, upload.single('file'), async (req, res) => {
    try {
        const content = await getContent(req);

        if (!content || content.trim().length < 50) {
            return res.status(400).json({ message: 'Content must be at least 50 characters (text or file)' });
        }

        const mindMap = await aiService.generateMindMap(content);
        res.json(mindMap);
    } catch (error) {
        console.error('Mind map error:', error);
        res.status(500).json({ message: 'Failed to generate mind map', error: error.message });
    }
});

// Generate flowchart endpoint
router.post('/flowchart', authMiddleware, upload.single('file'), async (req, res) => {
    try {
        const content = await getContent(req);

        if (!content || content.trim().length < 50) {
            return res.status(400).json({ message: 'Content must be at least 50 characters (text or file)' });
        }

        const flowchart = await aiService.generateFlowchart(content);
        res.json(flowchart);
    } catch (error) {
        console.error('Flowchart error:', error);
        res.status(500).json({ message: 'Failed to generate flowchart', error: error.message });
    }
});

// Chat endpoint (AI Help Bot)
router.post('/chat', authMiddleware, async (req, res) => {
    try {
        const { message, sessionId, conversationHistory = [] } = req.body;

        if (!message || message.trim().length === 0) {
            return res.status(400).json({ message: 'Message is required' });
        }

        let historyToUse = conversationHistory;

        // 🔒 Only touch DB if MongoDB is ACTIVE and user is logged in
        if (global.useMongoDb && req.user && sessionId) {
            try {
                const ChatSession = require('../models/ChatSession');
                const Message = require('../models/Message');

                const session = await ChatSession.findOne({ _id: sessionId, userId: req.userId });
                if (session) {
                    await new Message({
                        sessionId,
                        role: 'user',
                        content: message
                    }).save();

                    const recentMessages = await Message.find({ sessionId })
                        .sort({ timestamp: -1 })
                        .limit(5);

                    historyToUse = recentMessages.reverse().map(m => ({
                        role: m.role,
                        content: m.content
                    }));

                    session.updatedAt = Date.now();
                    await session.save();
                }
            } catch (dbError) {
                console.error('DB Error in chat (non-fatal):', dbError);
                historyToUse = conversationHistory;
            }
        }

        const response = await aiService.chat(message, historyToUse);

        // Save AI response if persistent and DB active
        if (global.useMongoDb && req.user && sessionId) {
            try {
                const Message = require('../models/Message');
                await new Message({
                    sessionId,
                    role: 'assistant',
                    content: response
                }).save();
            } catch (dbError) {
                console.error('DB Error saving response (non-fatal):', dbError);
            }
        }

        res.json({ response });
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ message: 'Failed to get chat response', error: error.message });
    }
});

// Multimodal analysis endpoint (image/video/audio + text)
router.post('/analyze-multimodal', authMiddleware, upload.single('file'), async (req, res) => {
    try {
        const { prompt } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ message: 'File is required' });
        }

        const fileData = {
            mimeType: file.mimetype,
            data: file.buffer.toString('base64')
        };

        const result = await aiService.analyzeMultimodal(
            prompt || 'Analyze this content and extract the main information',
            fileData
        );

        res.json({ result });
    } catch (error) {
        console.error('Multimodal analysis error:', error);
        res.status(500).json({ message: 'Failed to analyze content', error: error.message });
    }
});

// Helper to extract text from file (for chat context)
router.post('/extract-text', authMiddleware, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const text = await fileProcessingService.extractText(req.file);
        res.json({ text });
    } catch (error) {
        console.error('Extraction error:', error);
        res.status(500).json({ message: 'Failed to extract text' });
    }
});

module.exports = router;
