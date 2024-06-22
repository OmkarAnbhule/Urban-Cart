exports.mongodb = () => {
    const mongoose = require('mongoose')

    try {
        mongoose.connect(process.env.MONGODB_URI).then(() => {
            console.log('connection established to db')
        })
    }
    catch (e) {
        console.log('error connecting to db')
    }
}