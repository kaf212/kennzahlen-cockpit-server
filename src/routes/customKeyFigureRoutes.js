const express = require("express")
const mongoose = require("mongoose")
const CustomKeyFigure = require("../models/customKeyFigure")
const {authenticateAdmin} = require("../middleware/tokenValidation")

const router = express.Router()


router.get("/", async (req, res, next)=>{
    try {
        const keyFigures = await CustomKeyFigure.find({})
        return res.json(keyFigures)
    } catch (err) {
        next(err)
    }

})


module.exports = router