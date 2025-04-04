const express = require("express")
const {getCurrentKeyFigures, getHistoricKeyFigures} = require("../data_processing/queries")

const router = express.Router()


router.get("/current/:companyId", async (req, res) => {
    const companyId = req.params.companyId
    const result = await getCurrentKeyFigures(companyId)

    if (result === null) {
        return res.status(404).json({message: `no reports were found for company ${companyId}`})
    }

    return res.json(result)
})

router.get("/historic/:companyId", async (req, res, next)=>{
    const companyId = req.params.companyId
    const result = await getHistoricKeyFigures(companyId)

    if (result === null) {
        return res.status(404).json({message: `no reports were found for company ${companyId}`})
    }

    return res.json(result)
})


module.exports = router
