const express = require('express');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors')
const app = express();

//*****middleare********
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/"
}));

const allowedOrigins = ['http://localhost:5173' , 'https://urbancart-eight.vercel.app' , 'https://urbancart-omega.vercel.app'];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));
//*****import routes********
const userRoutes = require('./routes/user.route.cjs')
const productRoutes = require('./routes/product.route.cjs')

//*****routes********
app.use('/api/v1/user', userRoutes)
app.use('/api/v1/product', productRoutes)

module.exports = app;