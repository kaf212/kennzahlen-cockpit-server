const jwt = require('jsonwebtoken')
const express = require("express")

const secretKey = process.env.SECRET_KEY


function validateToken(req) {
    /*
    * Reads a JWT from the header of a provided http-request and validates the token.
    * Source: https://dev.to/jaimaldullat/a-step-by-step-guide-to-creating-a-restful-api-using-nodejs-and-express-including-crud-operations-and-authentication-2mo2
    * :param: req (object): http-request
    *
    * :return: jwtPayload (object): the payload of the JWT as an object.
    * :return: http-response (object)
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
    /*
    * Authenticates JWT for both standard and admin roles.
    * :param: req (object):     http-request
    * :param: res (object):     http-response
    * :param: next (function):  API route
    *
    * :return: void
    */
    req.jwtPayload = validateToken(req)
    next()
}

function authenticateAdmin(req, res, next) {
    /*
    * Authenticates JWT for admin-only API endpoints.
    * :param: req (object):     http-request
    * :param: res (object):     http-response
    * :param: next (function):  API route
    *
    * :return: void
    */
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

