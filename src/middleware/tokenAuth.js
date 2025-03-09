const jwt = require('jsonwebtoken')
const express = require("express")

const secretKey = process.env.SECRET_KEY

function authenticateToken(req, res, next) {
    // Source: https://dev.to/jaimaldullat/a-step-by-step-guide-to-creating-a-restful-api-using-nodejs-and-express-including-crud-operations-and-authentication-2mo2
    const token = req.header('Authorization')

    if (!token) {
        return res.status(401).json({ error: 'Authentication token missing' })
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token is invalid'})
        }
        req.user = user
        next()
    });
}

module.exports = authenticateToken

