const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        required: true,
    },
    isLogged: {
        type: Boolean,
        default: true,
    },
    lastLoginTime: {
        type: Date,
    },
    lastLogoutTime: {
        type: Date
    },
    deliveryAddress: {
        type: String,
    },
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }],
    rewards: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Reward'
    }],
    saved: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }],
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    timestamp: {
        type: Date,
        default: Date.now
    }
})

module.exports = new mongoose.model('User', userSchema)