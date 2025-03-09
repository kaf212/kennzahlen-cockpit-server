const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");

const secretKey = process.env.SECRET_KEY


const dummyDB = [
    // source: https://chatgpt.com/share/67cd74aa-913c-8011-8973-e782152c79de
    {name: "Admin", password: bcrypt.hashSync("admin", bcrypt.genSaltSync(10))},
    {name: "Standard", password: bcrypt.hashSync("standard", bcrypt.genSaltSync(10))}
    // Salt generation in async will cause error
]

function authenticateUser(res, role, password) {
    /*
    * Gets called for each login request and returns a JWT upon successful verification of the credentials
    * :param: res (object):     http-response
    * :param: role (str):       Name of the role
    * :param: password (str):   Password for the role
    *
    * :return: http-response
    */
    const foundRole = dummyDB.find((r) => r.name === role);

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
    return res.status(401).json({ error: 'Authentication failed: Incorrect password or role' })
}

module.exports = authenticateUser