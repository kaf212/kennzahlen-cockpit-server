const jwt = require('jsonwebtoken')
const express = require("express")
const authenticateUser = require("../auth/auth")
const authenticateToken = require("../middleware/tokenAuth")

const router = express.Router()
router.use(express.json())

const secretKey = process.env.SECRET_KEY


router.post("/login", (req, res)=>{
    console.log(req.body)
    const {role, password} = req.body
    console.log(req.body.role)
    const authenticatedRole = authenticateUser(role, password)

    if (!authenticatedRole) {
        return res.status(401).json({ error: 'Authentication failed' })
    }

    const token = jwt.sign({role: authenticatedRole.name}, secretKey, {
        expiresIn: '1h'
    });

    res.json(token)
})

router.get("/protected", authenticateToken, (req, res)=>{
    res.json("Access granted to protected route")
})

module.exports = router