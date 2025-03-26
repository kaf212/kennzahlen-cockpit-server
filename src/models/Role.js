const mongoose = require("mongoose")


const roleSchema = new mongoose.Schema({
    name: {type: String, required: true},
    password: {type: String}
})

const Role = mongoose.model('Role', roleSchema, "role")

module.exports = Role