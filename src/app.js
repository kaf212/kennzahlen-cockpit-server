const express = require("express")
const cors = require("cors")
const path = require("path")
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

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../../kennzahlen-cockpit-client/public')))


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

// Frontend fallback (needs to come last)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../kennzahlen-cockpit-client/public/index.html'))
})


connectDB().then(r => {
    console.log(r)
})

seedDB()

module.exports = app