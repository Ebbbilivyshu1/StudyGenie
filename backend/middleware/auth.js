const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (global.useMongoDb) {
            const User = require('../models/User');
            const user = await User.findById(decoded.userId).select('-password');

            if (!user) {
                return res.status(401).json({ message: 'User not found' });
            }

            req.user = user;
            req.userId = user._id;
        } else {
            // In-memory storage
            const user = global.inMemoryDB.users.find(u => u._id === decoded.userId);

            if (!user) {
                return res.status(401).json({ message: 'User not found' });
            }

            req.user = {
                _id: user._id,
                name: user.name,
                email: user.email
            };
            req.userId = user._id;
        }

        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = authMiddleware;
