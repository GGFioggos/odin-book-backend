const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

async function dbConnect() {
    const mongoDB = process.env.MONGO_URI;
    await mongoose.connect(mongoDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    const db = await mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
    db.once('open', function () {
        ('Connected to MongoDB!');
    });
}

module.exports = { dbConnect };
