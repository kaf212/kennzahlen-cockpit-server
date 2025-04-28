const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");
const Role = require("../models/Role")

const secretKey = process.env.SECRET_KEY

const loginAttempts = {}

function checkLoginAttempts(ip) {
    /**
     * Checks the loginAttempts object if the given IP address has reached the login attempt limit
     * or if this client has to wait for the login lock time to pass.
     * Source: https://chatgpt.com/share/680f9ff3-0f40-8011-888b-1991d1da8890
     *
     * @param {String} ip - The IP address from the login request.
     * @returns {Boolean} True if the user is allowed to attempt a login, false otherwise
     */
    const now = Date.now()
    if (!loginAttempts[ip]) {
        loginAttempts[ip] = { count: 0, lastAttempt: now }
    }

    const ipData = loginAttempts[ip]

    // Reset the attempt count to 0 if the lock time has passed since the last attempt
    if (now - ipData.lastAttempt > process.env.LOGIN_LOCK_TIME_MINUTES * 60 * 1000) {
        ipData.count = 0
    }

    ipData.lastAttempt = now

    // If the login attempt limit has been reached return false
    if (ipData.count >= process.env.MAX_LOGIN_ATTEMPTS) {
        return false
    }

    // Return true if the login attempt limit hasn't been reached and the lock time isn't active
    return true
}

function logFailedLoginAttempt(ip) {
    /**
     * Logs a failed login attempt inside the loginAttempts object.
     * Source: https://chatgpt.com/share/680f9ff3-0f40-8011-888b-1991d1da8890
     */
    if (!loginAttempts[ip]) {
        // Create a new entry for this IP if it hasn't tried logging in yet
        loginAttempts[ip] = { count: 1, lastAttempt: Date.now() }
    } else {
        // If the IP is already present inside the loginAttempts object, update its entry
        loginAttempts[ip].count += 1
        loginAttempts[ip].lastAttempt = Date.now()
    }
}

async function authenticateUser(req, res, requestRole, password) {
    /**
     * Gets called for each login request and returns a JWT upon successful verification of the credentials.
     * @param {Response} res - Http-response
     * @param {String} requestRole - Name of the requested role
     * @param {String} passwort - Password for the requested role
     */

    if (!checkLoginAttempts(req.ip)) {
        return res.status(401).json({message: "Authentication failed: Too many login attempts"})
    }

    const foundRole = await Role.findOne({name: requestRole})

    if (foundRole) {
        // Hash and compare the provided password with the hash value in the database
        // Source: https://dev.to/jaimaldullat/a-step-by-step-guide-to-creating-a-restful-api-using-nodejs-and-express-including-crud-operations-and-authentication-2mo2
        if (bcrypt.compareSync(password, foundRole.password)) {
            const token = jwt.sign({role: foundRole.name}, secretKey, {
                expiresIn: '1h'
            });
            return res.json({"token": token})
        }
    }

    logFailedLoginAttempt(req.ip)
    // For security reasons, error messages will not inform the user if the password or the role is incorrect.
    return res.status(401).json({message: 'Authentication failed: Incorrect password or role' })
}

module.exports = authenticateUser