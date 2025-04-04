const express = require("express")
const cors = require("cors")
require("dotenv").config();
const authRoutes = require("./routes/authRoutes")
const uploadRoutes = require("./routes/uploadRoutes")
const companyRoutes = require("./routes/companyRoutes")
const customKeyFigureRoutes = require("./routes/customKeyFigureRoutes")
const keyFigureRoutes = require("./routes/keyFigureRoutes")
const connectDB = require("../scripts/db")
const seedDB = require("../scripts/seedDB")

const app = express()

app.use(cors())
app.use(express.json())

app.use("/auth", authRoutes)
app.use("/upload", uploadRoutes)
app.use("/companies", companyRoutes)
app.use("/customKeyFigures", customKeyFigureRoutes)
app.use("/keyFigures", keyFigureRoutes)


// Automatically respond with 500 when next(err) is called in an endpoint
app.use((err, req, res, next) => {
    console.error("Server Error:", err);
    res.status(500).json({"message": "Internal Server Error"});
});


connectDB().then(r => {
    console.log(r)
})

seedDB()

module.exports = app