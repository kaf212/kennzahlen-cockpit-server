const express = require("express")
const mongoose = require("mongoose")
const CustomKeyFigure = require("../models/customKeyFigure")
const Report = require("../models/Report")
const {authenticateAdmin} = require("../middleware/tokenValidation")
const {customKeyFigure} = require("../data_processing/queries")
const {number} = require("mathjs");

const router = express.Router()


async function checkCustomKeyFigureExistenceByName(customKeyFigureName) {
    const found = await CustomKeyFigure.find({name: customKeyFigureName})
    if (found.length > 0) {
        return true
    }
    return false
}

async function checkCustomFigureExistenceById(customFigureId) {
    try {
        const found = await CustomKeyFigure.findById(customFigureId)
        if (found !== null) {
            return true
        }
        return false
    } catch (err) {}
    return false

}

async function validateFormula(formula) {
    /**
     * Validates a custom key figure formula string by parsing and calculating
     * for the default test report in the database with customKeyFigure() from data_processing.
     * If the calculation returns a valid result, the formula is valid, if the calculation fails, it is invalid.
     *
     * @param {string} formula - The formula string which needs to be validated
     * @return {boolean} - Success of the validation process as a boolean
     */
    let result = null
    try {
        result = await customKeyFigure({company_id: "testReport"}, formula)
    } catch (err) {
        return false
    }

    if (result.hasOwnProperty("company_id") && result.hasOwnProperty("customKeyFigure")) {
        return true
    } else {
        console.error("Invalid result from customKeyFigure calculation: ", result)
        return false
    }
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


router.post("/", async (req, res, next)=> {
    if (await checkCustomKeyFigureExistenceByName(req.body.name)) {
        return res.status(400).json({message: `custom key figure ${req.body.name} already exists`})
    }

    if (await validateFormula(req.body.formula) === false) {
        return res.status(400).json({message: "invalid formula"})
    }

    try {
        const newCustomKeyFigure = new CustomKeyFigure({name: req.body.name, formula: req.body.formula, type: req.body.type})
        await newCustomKeyFigure.save()
        return res.status(201).json({message: "custom key figure created successfully"})
    } catch (err) { // If mongoose model validation fails
        return res.status(400).json({message: "Invalid JSON format"})
    }

})


router.patch("/:id", authenticateAdmin, async (req, res, next)=>{
    const customKeyFigureJson = req.body
    const customKeyFigureId = req.params.id

    if (Object.keys(customKeyFigureJson).length === 0) {
        return res.status(400).json({message: "no JSON provided"})
    }

    if (!(await checkCustomFigureExistenceById(customKeyFigureId))) {
        return res.status(404).json({message: "custom key figure not found"})
    }

    if (await checkCustomKeyFigureExistenceByName(customKeyFigureJson.name) === true) {
        return res.status(400).json({message: `custom key figure with name ${customKeyFigureJson.name} already exists`})
    }

    if (await validateFormula(customKeyFigureJson.formula) === false) {
        return res.status(400).json({message: "invalid formula"})
    }

    /*
    Mongoose validation is not used here because it would not allow missing attributes,
    but missing attributes are normal in a PATCH endpoint when not every attribute needs to be updated.
    So validation is performed by checking if the provided attributes from the request exist in the mongoose model.
     */
    // Source: https://chatgpt.com/share/67e6cffc-4308-8011-bbea-5a4eda7b76f5
    const validFields = Object.keys(CustomKeyFigure.schema.paths); // Allowed fields from schema
    const invalidFields = Object.keys(customKeyFigureJson).filter(key => !validFields.includes(key));

    if (invalidFields.length > 0) {
        return res.status(400).json({message: "invalid attributes in JSON object"})
    }

    await CustomKeyFigure.findByIdAndUpdate(customKeyFigureId, {$set: customKeyFigureJson}, {new: true, runValidators: true})

    return res.status(201).json({message: "custom key figure updated successfully"})

})


router.delete("/:id", authenticateAdmin, async (req, res, next)=>{
    const customKeyFigureId = req.params.id

    if (!(await checkCustomFigureExistenceById(customKeyFigureId))) {
        return res.status(404).json({message: "custom key figure not found"})
    }

    await CustomKeyFigure.findByIdAndDelete(customKeyFigureId)
    return res.status(200).json({message: "custom key figure deleted successfully"})

})



module.exports = router