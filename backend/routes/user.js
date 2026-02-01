const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');
const QuizResult = require('../models/QuizResult');

// Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        res.json(req.user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update user profile
router.put('/profile', authMiddleware, async (req, res) => {
    try {
        const { name, profilePicture } = req.body;

        const user = await User.findById(req.userId);
        if (name) user.name = name;
        if (profilePicture) user.profilePicture = profilePicture;

        await user.save();

        res.json({
            message: 'Profile updated',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profilePicture: user.profilePicture
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Save quiz result
router.post('/results', authMiddleware, async (req, res) => {
    try {
        const { score, total, quizTitle } = req.body;

        const result = new QuizResult({
            userId: req.userId,
            score,
            total,
            quizTitle
        });

        await result.save();

        res.json({
            message: 'Result saved',
            resultId: result._id
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get user's quiz results
router.get('/results', authMiddleware, async (req, res) => {
    try {
        const results = await QuizResult.find({ userId: req.userId })
            .sort({ createdAt: -1 })
            .limit(50);

        res.json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
