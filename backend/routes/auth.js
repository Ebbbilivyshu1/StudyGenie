const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Use in-memory storage if MongoDB not available
const getUserModel = () => {
    if (global.useMongoDb) {
        return require('../models/User');
    }
    return null;
};

// In-memory user helpers
const findUserByEmail = (email) => {
    return global.inMemoryDB.users.find(u => u.email === email);
};

const createUser = async (name, email, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
        _id: Date.now().toString(),
        name,
        email,
        password: hashedPassword,
        createdAt: new Date()
    };
    global.inMemoryDB.users.push(user);
    return user;
};

// Signup
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (global.useMongoDb) {
            const User = getUserModel();
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'Email already exists' });
            }

            const user = new User({ name, email, password });
            await user.save();

            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

            res.status(201).json({
                message: 'Signup successful',
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            });
        } else {
            // In-memory storage
            const existing = findUserByEmail(email);
            if (existing) {
                return res.status(400).json({ message: 'Email already exists' });
            }

            const user = await createUser(name, email, password);
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

            res.status(201).json({
                message: 'Signup successful',
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (global.useMongoDb) {
            const User = getUserModel();
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

            res.json({
                message: 'Login successful',
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            });
        } else {
            // In-memory storage
            const user = findUserByEmail(email);
            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

            res.json({
                message: 'Login successful',
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Forgot password
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        if (global.useMongoDb) {
            const User = getUserModel();
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const resetToken = crypto.randomBytes(32).toString('hex');
            user.resetToken = resetToken;
            user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
            await user.save();

            const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}&email=${email}`;

            res.json({
                message: 'Password reset link sent',
                resetLink
            });
        } else {
            res.json({ message: 'Feature requires MongoDB to be installed' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Reset password
router.post('/reset-password', async (req, res) => {
    try {
        const { email, token, newPassword } = req.body;

        if (global.useMongoDb) {
            const User = getUserModel();
            const user = await User.findOne({
                email,
                resetToken: token,
                resetTokenExpiry: { $gt: Date.now() }
            });

            if (!user) {
                return res.status(400).json({ message: 'Invalid or expired reset token' });
            }

            user.password = newPassword;
            user.resetToken = undefined;
            user.resetTokenExpiry = undefined;
            await user.save();

            res.json({ message: 'Password reset successful' });
        } else {
            res.json({ message: 'Feature requires MongoDB to be installed' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
