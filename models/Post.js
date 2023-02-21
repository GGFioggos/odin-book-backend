const mongoose = require('mongoose');
var { format } = require('date-fns');
const months = require('../utils/datehelper');

const Schema = mongoose.Schema;

const opts = { toJSON: { virtuals: true } };

const PostSchema = new Schema(
    {
        author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        content: { type: String, required: true },
        timestamp: { type: Date, required: true },
        comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
        likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    },
    opts
);

PostSchema.virtual('formatted_time').get(function () {
    return format(new Date(this.timestamp), "dd MMMM yyyy ' at ' HH:mm");
});

PostSchema.virtual('time_diff').get(function () {
    const diffInMilliseconds = Math.abs(this.timestamp - Date.now());
    const diffInHours = Math.ceil(diffInMilliseconds / (1000 * 60 * 60));
    if (diffInHours < 24) {
        return diffInHours + 'Hours ago';
    } else if (diffInHours < 168) {
        return Math.floor(diffInHours / 24) + ' Days ago';
    } else {
        const date = new Date(this.timestamp);
        return (
            date.getDate() +
            ' ' +
            months[date.getMonth()] +
            ' ' +
            date.getFullYear()
        );
    }
});

module.exports = mongoose.model('Post', PostSchema);
