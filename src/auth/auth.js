const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");
const Role = require("../models/Role")


async function authenticateUser(res, requestRole, password) {
    /**
     * Gets called for each login request and returns a JWT upon successful verification of the credentials.
     * @param {Response} res - Http-response
     * @param {String} requestRole - Name of the requested role
     * @param {String} passwort - Password for the requested role
     */

    const secretKey = process.env.SECRET_KEY

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
    // For security reasons, error messages will not inform the user if the password or the role is incorrect.
    return res.status(401).json({message: 'Authentication failed: Incorrect password or role' })
}

module.exports = authenticateUser