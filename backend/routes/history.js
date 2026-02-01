const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const ChatSession = require('../models/ChatSession');
const Message = require('../models/Message');

// Get all chat sessions for the logged-in user
router.get('/sessions', authMiddleware, async (req, res) => {
    if (!global.useMongoDb) return res.json([]);

    try {
        const sessions = await ChatSession.find({ userId: req.userId })
            .sort({ updatedAt: -1 });
        res.json(sessions);
    } catch (error) {
        console.error('Error fetching sessions:', error);
        res.status(500).json({ message: 'Failed to fetch chat sessions' });
    }
});

// Create a new chat session
router.post('/sessions', authMiddleware, async (req, res) => {
    if (!global.useMongoDb) {
        // Return a mock session ID so frontend doesn't break, or just error gracefully
        // Frontend expects: { _id: ..., title: ... }
        return res.status(201).json({
            _id: 'temp_' + Date.now(),
            title: req.body.title || 'New Chat (Temporary)',
            userId: req.userId,
            createdAt: new Date(),
            updatedAt: new Date()
        });
    }

    try {
        const session = new ChatSession({
            userId: req.userId,
            title: req.body.title || 'New Chat'
        });
        await session.save();
        res.status(201).json(session);
    } catch (error) {
        console.error('Error creating session:', error);
        res.status(500).json({ message: 'Failed to create chat session' });
    }
});

// Get messages for a specific session
router.get('/sessions/:sessionId/messages', authMiddleware, async (req, res) => {
    if (!global.useMongoDb) return res.json([]);

    try {
        const session = await ChatSession.findOne({
            _id: req.params.sessionId,
            userId: req.userId
        });

        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        const messages = await Message.find({ sessionId: req.params.sessionId })
            .sort({ timestamp: 1 });

        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Failed to fetch messages' });
    }
});

// Delete a session
router.delete('/sessions/:sessionId', authMiddleware, async (req, res) => {
    if (!global.useMongoDb) return res.status(404).json({ message: 'Session not found (in-memory mode)' });

    try {
        // Verify ownership
        const session = await ChatSession.findOne({
            _id: req.params.sessionId,
            userId: req.userId
        });

        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        // Delete messages first
        await Message.deleteMany({ sessionId: req.params.sessionId });
        // Delete session
        await ChatSession.deleteOne({ _id: req.params.sessionId });

        res.json({ message: 'Session deleted successfully' });
    } catch (error) {
        console.error('Error deleting session:', error);
        res.status(500).json({ message: 'Failed to delete session' });
    }
});

module.exports = router;
