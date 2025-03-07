// Source: https://www.geeksforgeeks.org/how-to-connect-node-js-to-a-mongodb-database/

const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017/collectionName", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

