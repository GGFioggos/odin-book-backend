const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const mongoDB = process.env.MONGO_URI;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function () {
    ('Connected to MongoDB!');
});
