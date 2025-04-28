const jwt = require('jsonwebtoken')
const express = require("express")
const authenticateUser = require("../auth/auth")
const {authenticateToken, authenticateAdmin} = require("../middleware/tokenValidation")

const router = express.Router()
router.use(express.json())



router.post("/login", (req, res)=>{
    console.log(req.ip)
    const {role, password} = req.body
    authenticateUser(req, res, role, password)
})

router.get("/protected", authenticateToken, (req, res)=>{
    res.json(`Access granted to protected route ${req.jwtPayload.role}`)
})

router.get("/admin", authenticateAdmin, (req, res)=>{
    res.json(`Access granted to protected route ${req.jwtPayload.role}`)
})

module.exports = router