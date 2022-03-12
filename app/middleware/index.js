const { getToken } = require("../../utils")
const jwt = require('jsonwebtoken')
const config = require('../config')
const User = require('../user/models')

function decodeToken() {
    return async function (res, req, next) {
        try {
            let token = getToken(req)

            if(!token) return next()

            req.user = jwt.verify(token, config.secretKey)

            let user = await User.findOne({token: {$in: [token]}})

            if(!user) {
                res.json({
                    error: 1,
                    message: 'Token Expired'
                })
            }
        } catch (err) {
            if(err && err.name === 'JsonWebTokenError') {
                return res.json({
                    error: 1,
                    message: err.message
                })
            }
            next(err)
        }
        return next()
    }
}

module.exports = {
    decodeToken
}