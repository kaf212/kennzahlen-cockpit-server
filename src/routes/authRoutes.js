const jwt = require('jsonwebtoken')
const express = require("express")
const authenticateUser = require("../auth/auth")
const {authorizeStandard, authorizeAdmin} = require("../middleware/tokenValidation")
const {catchAsync} = require("../middleware/errorHandling");

const router = express.Router()
router.use(express.json())



router.post("/login", catchAsync(async (req, res)=>{
    if (!req.body.hasOwnProperty("role") || !req.body.hasOwnProperty("password")) {
        return res.status(400).json({message: "Invalid JSON format"})
    }

    const {role, password} = req.body
    return await authenticateUser(req, res, role, password)
}))

router.get("/protected", authorizeStandard, ((req, res)=>{
    res.json(`Access granted to protected route ${req.jwtPayload.role}`)
}))

router.get("/admin", authorizeAdmin, ((req, res)=>{
    res.json(`Access granted to protected route ${req.jwtPayload.role}`)
}))

module.exports = router