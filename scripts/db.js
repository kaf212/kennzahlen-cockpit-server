
const mongoose = require("mongoose")

async function connectDB() {
    /**
     * Connects the server to the MongoDB database.
     * @returns {String} - Success or error message
     */
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

