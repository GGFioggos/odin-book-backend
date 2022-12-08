const mongoose = require('mongoose');
var { format } = require('date-fns');

const Schema = mongoose.Schema;

const postSchema = new Schema({
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, required: true },
    comments: { type: Schema.Types.ObjectId, ref: 'Comment' },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

postSchema.virtual('formatted_time').get(function () {
    return format(new Date(this.timestamp), "dd MMMM yyyy ' at ' HH:mm");
});
