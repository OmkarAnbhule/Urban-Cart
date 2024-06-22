const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    files: [{
        type: String,
    }],
    price: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Review'
    }],
    timeStamp: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Product', productSchema)