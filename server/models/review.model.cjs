const mongoose = require('mongoose')

const reviewSchema = mongoose.Schema({
    review: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    files: [{
        type: String,
    }],
    likeCount: {
        type: Number,
        default: 0
    },
    likedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    timeStamp: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Review', reviewSchema)