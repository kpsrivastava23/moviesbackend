const mongoose = require('mongoose');

async function connectToDatabase() {
    try {
        await mongoose.connect('mongodb+srv://kpsrivastava:Kshitij12@kpsrivastava.qbhiqum.mongodb.net/movie?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB Atlas');
    } catch (error) {
        console.error('Error connecting to MongoDB Atlas:', error);
    }
}

module.exports = connectToDatabase;
