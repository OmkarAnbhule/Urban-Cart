const mongoose = require('mongoose');

const adSchema = mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product'
    },
})

module.exports = mongoose.model('Ads', adSchema)