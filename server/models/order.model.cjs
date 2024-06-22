const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
    ProductId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    }],
    PaymentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment',
        required: true
    },
    productCount: {
        type: Number,
        required: true
    },
    orderBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    TotalPrice: {
        type: Number,
    },
    orderProcess: [{
        date: {
            type: Date,
            default: Date.now
        },
        status: {
            type: String,
            default: 'order placed'
        }
    }],
    status: {
        type: String,
        enum: ['order placed', 'order shipped', 'order pickup', 'order delivered'],
        default: 'order placed'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})

module.exports = mongoose.model('Order', orderSchema)