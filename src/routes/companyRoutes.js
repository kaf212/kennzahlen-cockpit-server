const express = require("express")
const mongoose = require("mongoose")
const sanitizeHtml = require("sanitize-html")
const Company = require("../models/Company")
const {authenticateAdmin, authenticateToken} = require("../middleware/tokenValidation")

const router = express.Router()

async function checkCompanyExistenceByName(companyName) {
    /**
     * Searches the database for a company with the provided name and returns a boolean based on the result.
     *
     * @param {String} companyName - The name of the company
     * @returns {Boolean} True, if the company exists, false otherwise
     */
    const found = await Company.find({name: companyName})
    if (found.length > 0) { // Company.find() returns an array, which would always evaluate as true
        return true
    }
    return false
}

async function checkCompanyExistenceById(companyId) {
    /**
     * Searches the database for a company with the provided ID and returns a boolean based on the result.
     *
     * @param {String} companyId - The ID of the company
     * @returns {Boolean} True, if the company exists, false otherwise
     */
    try {
        const found = await Company.findById(companyId)
        if (found !== null) {
            return true
        }
        return false
    } catch (err) {
    }
    return false

}

router.get("/", authenticateToken, async (req, res, next) => {
    try {
        const companies = await Company.find({})
        return res.json(companies)
    } catch (err) {
        next(err)
    }

})

router.get("/:id", authenticateToken, async (req, res, next) => {
    try {
        // Source: https://stackoverflow.com/questions/53686554/validate-mongodb-objectid
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) { // check if objectID is of valid format
            return res.status(400).json({message: "invalid ID format"})
        }

        const company = await Company.findById(req.params.id)
        if (!company) {
            return res.status(404).json({message: "company not found"})
        }
        return res.json(company)
    } catch (err) {
        next(err)
    }
})

router.post("/", authenticateAdmin, async (req, res, next) => {
    if (!req.body.hasOwnProperty("name")) {
        return res.status(400).json({message: "invalid json format"})
    }
    if (await checkCompanyExistenceByName(req.body.name)) {
        return res.status(400).json({message: `company ${req.body.name} already exists`})
    }

    if (req.body.name.length > 30) {
        return res.status(400).json({message: "name must be shorter than 30 characters"})
    }

    const sanitizedCompanyName = sanitizeHtml(req.body.name, {
        allowedTags: [],
        allowedAttributes: {}
    })

    const newCompany = new Company({name: sanitizedCompanyName})
    await newCompany.save()
    res.status(201).json({message: "company created successfully"})
})


router.patch("/:id", authenticateAdmin, async (req, res, next) => {
    const companyJson = req.body
    const companyId = req.params.id

    if (!(await checkCompanyExistenceById(companyId))) {
        return res.status(404).json({message: "company not found"})
    }

    if (!companyJson.hasOwnProperty("name")) {
        return res.status(400).json({message: "invalid json format"})
    }

    if (await checkCompanyExistenceByName(companyJson.name) === true) {
        return res.status(400).json({message: `company with name ${req.body.name} already exists`})
    }

    if (req.body.hasOwnProperty("name")) {
        if (req.body.name.length > 30) {
            return res.status(400).json({message: "name must be shorter than 30 characters"})
        }

        companyJson.name = sanitizeHtml(companyJson, {
            allowedTags: [],
            allowedAttributes: {}
        })
    }

    await Company.findByIdAndUpdate(companyId, {$set: companyJson}, {runValidators: true})
    return res.status(201).json({message: "company updated successfully"})
})

router.delete("/:id", authenticateAdmin, async (req, res, next) => {
    const companyId = req.params.id

    if (!(await checkCompanyExistenceById(companyId))) {
        return res.status(404).json({message: "company not found"})
    }

    await Company.findByIdAndDelete(companyId)
    return res.status(200).json({message: "company deleted successfully"})

})


module.exports = router
