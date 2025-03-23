const jwt = require('jsonwebtoken')
const express = require("express")

const secretKey = process.env.SECRET_KEY


function validateToken(req, res) {
    /*
    * Reads a JWT from the header of a provided http-request and validates the token.
    * Source: https://dev.to/jaimaldullat/a-step-by-step-guide-to-creating-a-restful-api-using-nodejs-and-express-including-crud-operations-and-authentication-2mo2
    * :param: req (object): http-request
    *
    * :return: jwtPayload (object): the payload of the JWT as an object.
    * :return: http-response (object)
    */


    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: 'Authentication token missing or malformed' });
    }

    /*
    Prevent jwtPayload from being undefined
    Bug found by ChatGPT (https://chatgpt.com/share/67e01958-bc68-8011-8db0-16deafd5fd7b)
     */
    try {
        const payload = jwt.verify(token, secretKey);
        return payload;
    } catch (err) {
        return res.status(403).json({ error: 'Token is invalid' });
    }
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


    const payload = validateToken(req, res);
    if (!payload.role) return; // Stops execution if token is invalid
    // Bug found by ChatGPT (https://chatgpt.com/share/67e01958-bc68-8011-8db0-16deafd5fd7b)

    req.jwtPayload = payload
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
        return res.status(401).json("Authentication failed: admin privileges required")
    }
    else {
        req.jwtPayload = jwtPayload
        next()
    }
}

module.exports = {authenticateToken, authenticateAdmin}

