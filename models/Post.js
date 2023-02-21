const mongoose = require('mongoose');
var { format } = require('date-fns');
const { timeDiff } = require('../utils/datehelper');

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
    return timeDiff(this.timestamp);
});

module.exports = mongoose.model('Post', PostSchema);
