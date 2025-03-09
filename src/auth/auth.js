const bcrypt = require('bcrypt')


const dummyDB = [
    // source: https://chatgpt.com/share/67cd74aa-913c-8011-8973-e782152c79de
    {name: "Admin", password: bcrypt.hashSync("admin", bcrypt.genSaltSync(10))},
    {name: "Standard", password: bcrypt.hashSync("standard", bcrypt.genSaltSync(10))}
    // Salt generation in async will cause error
]

function authenticateUser(role, password) {
    const foundRole = dummyDB.find((r) => r.name === role);

    if (!foundRole) {
        console.error(`Role not found: ${role}`)
    }
    // source: https://dev.to/jaimaldullat/a-step-by-step-guide-to-creating-a-restful-api-using-nodejs-and-express-including-crud-operations-and-authentication-2mo2
    if (bcrypt.compareSync(password, foundRole.password)) {
        return foundRole
    }
}

module.exports = authenticateUser