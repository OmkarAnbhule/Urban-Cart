require('dotenv').config();
const app = require('./app.cjs');
const { mongodb } = require('./database/mongoDB.cjs')
const { cloudinaryDB } = require('./database/cloudinaryDB.cjs')
const { uploadOrderStatus } = require('./utils/updateOrderStatus.cjs')

app.listen(process.env.PORT || 5000, () => {
    console.log('Server is running on port 5000')
})


app.get('/', (req, res) => {
    res.send('Server started');
})


mongodb()
cloudinaryDB()
uploadOrderStatus()