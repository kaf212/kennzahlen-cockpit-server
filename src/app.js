const express = require("express")
const cors = require("cors")
require("dotenv").config();
const authRoutes = require("./routes/authRoutes")
const uploadRoutes = require("./routes/uploadRoutes")
const connectDB = require("../scripts/db")
const seedDB = require("../scripts/seedDB")

const app = express()

app.use(cors())
app.use(express.json())

app.use("/auth", authRoutes)
app.use("/upload", uploadRoutes)

app.use((err, req, res, next) => {
    console.error("Server Error:", err);
    res.status(err.status || 500).json({message: err.message});
});

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({message: err.message})
})

connectDB().then(r => {
    console.log(r)
})

seedDB()

module.exports = app