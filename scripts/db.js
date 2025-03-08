
const mongoose = require("mongoose")

async function connectDB() {
    try {
        // Source: https://www.geeksforgeeks.org/how-to-connect-node-js-to-a-mongodb-database/
        await mongoose.connect("mongodb://localhost:27017/kennzahlen", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        return "MongoDB connected"
    }
        catch (err) {
            return `MongoDB connection failed: ${err}`
    }

}

module.exports = connectDB

