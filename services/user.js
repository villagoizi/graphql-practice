const {User} = require('../models')
const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = {
    async getUserByEmail(x) {
        return await User.findOne({email: x})
    },
    async getUserById(x) {
        return await User.findById(x)
    }
    ,
    jwtSign(payload) {
        
        return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' }) 
    }
}