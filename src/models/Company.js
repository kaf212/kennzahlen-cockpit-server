const companySchema = new mongoose.Schema({
    _id: {
        type: String,
        match: /^[a-fA-F0-9]{24}$/, // Match for MongoDB ObjectId string format
    },
    name: {type: String}
})

const Company = mongoose.model('Company', companySchema)

module.exports = Company