const express = require("express")
const cors = require("cors")
const path = require("path")
const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs')
const authRoutes = require("./routes/authRoutes")
const uploadRoutes = require("./routes/uploadRoutes")
const companyRoutes = require("./routes/companyRoutes")
const customKeyFigureRoutes = require("./routes/customKeyFigureRoutes")
const keyFigureRoutes = require("./routes/keyFigureRoutes")
const connectDB = require("../scripts/db")
const seedDB = require("../scripts/seedDB")

require('dotenv').config();

const swaggerPath = path.join(__dirname, "../swagger.yaml")
const swaggerDocument = YAML.load(swaggerPath)

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.use("/api/auth", authRoutes)
app.use("/api/upload", uploadRoutes)
app.use("/api/companies", companyRoutes)
app.use("/api/customKeyFigures", customKeyFigureRoutes)
app.use("/api/keyFigures", keyFigureRoutes)


// Automatically respond with 500 when next(err) is called in an endpoint
app.use((err, req, res, next) => {
    console.error("Server Error:", err);
    res.status(500).json({"message": "Internal Server Error"});
});


// Serve frontend static files (needs to after API routes)
app.use(express.static(path.join(__dirname, '../../kennzahlen-cockpit-client/public')))

// Serve styles
app.use('/styles', express.static(path.join(__dirname, '../../kennzahlen-cockpit-client/src/styles')))

// Serve JS
app.use('/js', express.static(path.join(__dirname, '../../kennzahlen-cockpit-client/src/js')))

// Frontend fallback
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../kennzahlen-cockpit-client/public/index.html'))
})


connectDB().then(r => {
    console.log(r)
})

seedDB()

module.exports = app