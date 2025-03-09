const jwt = require('jsonwebtoken')
const express = require("express")

const secretKey = process.env.SECRET_KEY


function validateToken(req) {
    /*
    * Reads a JWT from the header of a provided http-request and validates the token.
    * Returns the payload of the JWT as an object.
    * Source: https://dev.to/jaimaldullat/a-step-by-step-guide-to-creating-a-restful-api-using-nodejs-and-express-including-crud-operations-and-authentication-2mo2
    */

    const token = req.header('Authorization')

    if (!token) {
        return res.status(401).json({ error: 'Authentication token missing' })
    }
    let jwtPayload = undefined
    jwt.verify(token, secretKey, (err, payload) => {
        if (err) {
            return res.status(403).json({ error: 'Token is invalid'})
        }
        jwtPayload = payload
    });
    return jwtPayload
}

function authenticateToken(req, res, next) {
    // Authenticates JWT for both standard and admin roles
    req.jwtPayload = validateToken(req)
    next()
}

function authenticateAdmin(req, res, next) {
    const jwtPayload = validateToken(req)
    if (jwtPayload.role !== "Admin") {
        res.status(401).json("Authentication failed: admin privileges required")
    }
    else {
        req.jwtPayload = jwtPayload
        next()
    }
}

module.exports = {authenticateToken, authenticateAdmin}

