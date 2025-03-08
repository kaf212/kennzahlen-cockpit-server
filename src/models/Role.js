const mongoose = require("mongoose")


const roleSchema = new mongoose.Schema({
    name: {type: String},
    password: {type: String}
})

const Role = mongoose.model('Role', roleSchema, "role")

module.exports = Role