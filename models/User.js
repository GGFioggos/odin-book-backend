const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const opts = { toJSON: { virtuals: true } };

const userSchema = new Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, select: false },
        facebookId: { type: String },
        profilePictureUrl: { type: String },
        posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
        friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        friendRequests: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    },
    opts
);

userSchema.virtual('url').get(function () {
    return `/user/${this._id}`;
});

userSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model('User', userSchema);
