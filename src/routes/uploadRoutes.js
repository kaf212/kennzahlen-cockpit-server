const express = require("express")
const multer = require("multer")
const { spawnSync } = require('child_process');
const path = require("path")
const fs = require("fs")

const router = express.Router()
router.use(express.json())


// Ensure 'uploads' directory exists
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer configuration
// Source: https://dev.to/malikbilal111/building-a-file-upload-rest-api-with-nodejs-and-express-56l2
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const upload = multer({ storage });


router.post("/", upload.single("file"), async (req, res)=>{
    // File must be sent using multipart/form-data with the key "file" in the form

    const pythonProcess = await spawnSync('python', [
        '../DataProcessing/mock_xlsx_reader.py',
        'main',
        '../uploads/1742846096188-test_file_01.xlsx'
    ]);
    const result = pythonProcess.stdout?.toString()?.trim();
    const error = pythonProcess.stderr?.toString()?.trim();
    console.log(result)
    if (error) {
        console.error(error)
    }

    res.json({"message": "File upload successful"})

})

module.exports = router