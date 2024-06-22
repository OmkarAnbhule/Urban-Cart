require('dotenv').config()
const mongoose = require('mongoose');
const OTP = require('../models/otp.model.cjs')
const User = require('../models/user.model.cjs')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.verifyOtp = async (req, resp, next) => {
    try {
        const { email, otp, count } = req.body;
        const response = await OTP.findOne({ email }).sort({ createdAt: -1 }).limit(1);
        response.count = response.count + 1;
        response.save()
        if (email == '' || otp == '' || count == null || count != response.count) {
            return resp.status(400).send({ success: false, message: 'invalid credentials' })
        }
        if ((response.count > 3)) {
            return resp.status(400).send({ success: false, message: 'your connection has been terminated try after some time' });
        }
        if (response.length === 0 || otp !== response.otp) {
            return resp.status(400).send({ success: false, message: 'invalid otp' })
        }
        next()
    }
    catch (e) {
        console.log(e)
        return resp.status(500).send({ success: false, message: 'internal server error' })
    }
}

exports.isLogin = async (req, resp, next) => {
    if (req.body.isLogin) {
        const user = await User.findOne({ email: req.body.email })
        if (user) {
            const isHashedPassword = bcrypt.compare(user.password, req.body.password)
            if (isHashedPassword) {
                next()
            }
            else {
                return resp.status(400).send({ success: false, message: 'Incorrect password' })
            }
        }
        else {
            return resp.status(404).send({ success: false, message: 'User not found' })
        }
    }
    else {
        next()
    }
}

exports.auth = async (req, resp, next) => {
    try {
        const token = req.cookies.USR_TKN || req.headers['authorization'].replace("Bearer ", "");
        if (!token) {
            resp.status(500).json({
                success: false,
                message: "token not found",
                error
            })
        }
        try {

            const data = jwt.verify(token, process.env.TOKEN_SECRET)
            req.user = data;
            next()

        } catch (error) {
            console.log(error)
            resp.status(400).json({
                success: false,
                message: "User not verifed",
                error
            })
        }

    } catch (error) {
        console.log("ERROR in auth middleware", error),
            resp.status(500).json({
                success: false,
                error
            })
    }
}
