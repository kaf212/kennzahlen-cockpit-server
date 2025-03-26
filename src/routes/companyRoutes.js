const express = require("express")
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

module.exports = router
