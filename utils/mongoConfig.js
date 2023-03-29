const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const dbConnect = async () => {
    const mongoDB = process.env.MONGO_URI;

    const db = await mongoose.connect(mongoDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
};

module.exports = { dbConnect };
