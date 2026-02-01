const mongoose = require('mongoose');

const connectDB = async () => {
    if (!process.env.MONGODB_URI) {
        console.warn('MongoDB disabled → In-memory mode');
        global.useMongoDb = false;
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ MongoDB connected successfully');
        global.useMongoDb = true;
    } catch (err) {
        console.error('❌ MongoDB failed → In-memory fallback');
        global.useMongoDb = false;
    }
};

module.exports = connectDB;
