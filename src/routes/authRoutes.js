const express = require("express");
const router = express.Router();
const authenticateUser = require("../auth/auth");
const { authenticateToken, authenticateAdmin } = require("../middleware/tokenValidation"); // ✅ jetzt korrekt

router.use(express.json())

router.post("/login", (req, res) => {
    console.log("Login-Anfrage erhalten:", req.body);
    const { role, password } = req.body;
    authenticateUser(res, role, password);
});


router.get("/protected", authenticateToken, (req, res)=>{
    res.json(`Access granted to protected route ${req.jwtPayload.role}`)
})

router.get("/admin", authenticateAdmin, (req, res)=>{
    res.json(`Access granted to protected route ${req.jwtPayload.role}`)
})

module.exports = router