const express = require("express")
const {getCurrentKeyFigures} = require("../data_processing/queries")

const router = express.Router()


router.get("/current/:companyId", async (req, res) => {
    const companyId = req.params.companyId
    const result = await getCurrentKeyFigures(companyId)
    return res.json(result)
})


module.exports = router
