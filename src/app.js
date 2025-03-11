const express = require("express")
const cors = require("cors")
const connectDB = require("../scripts/db")
const seedDB = require("../scripts/seedDB")


const app = express()

app.use(cors())
app.use(express.json())


app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ message: err.message })
})

connectDB().then(r => {
    console.log(r)
})

seedDB()

module.exports = app