const mongoose = require('mongoose')

const paymentSchema = mongoose.Schema({
    cardHolder: {
        type: String,
        required: true
    },
    cardNumber: {
        type: String,
        required: true
    },
    cardMonth: {
        type: String,
        required: true
    },
    cardYear: {
        type: String,
        required: true
    },
    cardCVV: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Payment', paymentSchema)