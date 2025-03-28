const express = require("express")
const mongoose = require("mongoose")
const CustomKeyFigure = require("../models/customKeyFigure")
const {authenticateAdmin} = require("../middleware/tokenValidation")

const router = express.Router()


async function checkCustomKeyFigureExistenceByName(customKeyFigureName) {
    const found = await CustomKeyFigure.find({name: customKeyFigureName})
    if (found.length > 0) {
        return true
    }
    return false
}

async function checkCustomFigureExistenceById(customFigreId) {
    try {
        const found = await CustomKeyFigure.findById(customFigreId)
        if (found !== null) {
            return true
        }
        return false
    } catch (err) {}
    return false

}

router.get("/", async (req, res, next)=>{
    try {
        const keyFigures = await CustomKeyFigure.find({})
        return res.json(keyFigures)
    } catch (err) {
        next(err)
    }

})

router.get("/:id", async (req, res, next)=> {
    try {
        // Source: https://stackoverflow.com/questions/53686554/validate-mongodb-objectid
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) { // check if objectID is of valid format
            return res.status(400).json({message: "invalid ID format"})
        }

        const customKeyFigure = await CustomKeyFigure.findById(req.params.id)
        if (!customKeyFigure) {
            return res.status(404).json({message: "custom key figure not found"})
        }
        return res.json(customKeyFigure)
    } catch (err) {
        next(err)
    }
})


router.post("/",async (req, res, next)=> {
    if (await checkCustomKeyFigureExistenceByName(req.body.name)) {
        return res.status(400).json({message: `custom key figure ${req.body.name} already exists`})
    }
    try {
        const newCustomKeyFigure = new CustomKeyFigure({name: req.body.name, formula: req.body.formula})
        await newCustomKeyFigure.save()
        return res.status(201).json({message: "custom key figure created successfully"})
    } catch (err) { // If mongoose model validation fails
        return res.status(400).json({message: "Invalid JSON format"})
    }

})


router.patch("/:id",async (req, res, next)=>{
    const customKeyFigureJson = req.body
    const customKeyFigureId = req.params.id

    if (!(await checkCustomFigureExistenceById(customKeyFigureId))) {
        return res.status(404).json({message: "custom key figure not found"})
    }

    if (await checkCustomKeyFigureExistenceByName(customKeyFigureJson.name) === true) {
        return res.status(400).json({message: `custom key figure with name ${customKeyFigureJson.name} already exists`})
    }

    try {
        // Create a new CustomKeyFigure object and validate it with mongoose according to the rules of the model
        const validationObject = new CustomKeyFigure({name: customKeyFigureJson.name, formula: customKeyFigureJson.formula})
        await validationObject.validate()
    } catch (err) {
        return res.status(400).json({message: "Invalid JSON format"})

    }

    const result = await CustomKeyFigure.findByIdAndUpdate(customKeyFigureId, {$set: customKeyFigureJson}, {runValidators: true})
    return res.status(201).json({message: "custom key figure updated successfully"})

})



module.exports = router