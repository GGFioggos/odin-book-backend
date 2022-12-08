const mongoose = require('mongoose');
var { format } = require('date-fns');

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true, maxLength: 250 },
    timestamp: { type: Date, required: true },
    post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

CommentSchema.virtual('formatted_time').get(function () {
    return format(new Date(this.timestamp), "dd MMMM yyyy ' at ' HH:mm");
});

module.exports = mongoose.model('Comment', CommentSchema);
