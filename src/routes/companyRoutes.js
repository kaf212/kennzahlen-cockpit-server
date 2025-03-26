const express = require("express")
const mongoose = require("mongoose")
const Company = require("../models/Company")

const router = express.Router()


router.get("/", async (req, res, next)=>{
    try {
        const companies = await Company.find({})
        return res.json(companies)
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

        const company = await Company.findById(req.params.id)
        if (!company) {
            return res.status(404).json({message: "company not found"})
        }
        return res.json(company)
    } catch (err) {
        next(err)
    }
})

module.exports = router
