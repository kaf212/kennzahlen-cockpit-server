const mongoose = require("mongoose")


const companySchema = new mongoose.Schema({
    name: {type: String}
})

const Company = mongoose.model('Company', companySchema, "company")

module.exports = Company