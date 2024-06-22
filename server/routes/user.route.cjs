const router = require('express').Router()
const { createUser, verfiyUser, sendOtp, loginUser, getUser, logout, updateUser, getSaved, addSaved, removeSaved } = require('../controllers/user.controller.cjs')
const { verifyOtp, isLogin, auth } = require('../middlewares/auth.cjs')

router.post('/sendOTP', isLogin, sendOtp)
router.post('/create', verifyOtp, createUser)
router.post('/login', verifyOtp, loginUser)
router.get('/isLoggedIn', auth, isLogin)
router.get('/verify/:email', verfiyUser)
router.get('/logout', auth, logout)
router.get('/:id', auth, getUser)
router.post('/update', auth, updateUser)
router.get('/save/saved', auth, getSaved)
router.put('/save/:productId', auth, addSaved)
router.delete('/save/:productId', auth, removeSaved)

module.exports = router