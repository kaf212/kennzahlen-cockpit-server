const roleSchema = new mongoose.Schema({
    _id: {
        type: String,
        match: /^[a-fA-F0-9]{24}$/, // Match for MongoDB ObjectId string format
    },
    name: {type: String},
    password: {type: String}
})

const Role = mongoose.model('Role', roleSchema)

module.exports = Role