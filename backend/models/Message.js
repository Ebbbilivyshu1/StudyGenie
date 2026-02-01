const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ChatSession',
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'assistant'],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    attachments: [{
        type: {
            type: String,
            enum: ['image', 'file', 'audio']
        },
        name: String,
        data: String // Storing small metadata or base64/link. For now simplify.
    }],
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Message', messageSchema);
