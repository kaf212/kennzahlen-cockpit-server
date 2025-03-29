const express = require("express")
const multer = require("multer")
const { spawnSync } = require('child_process');
const path = require("path")
const fs = require("fs")

const router = express.Router()
router.use(express.json())

function cleanUploadDirectory() {
    // Source: https://hayageek.com/remove-all-files-from-directory-in-nodejs/
    const uploadDir = "uploads"
    const files = fs.readdirSync(uploadDir);

    for (const file of files) {
        const filePath = path.join(uploadDir, file);
        fs.unlinkSync(filePath);
    }
}


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

    if (!req.file) {
        return res.status(400).json({message: "no file provided"})
    }
    const fileType = req.file.mimetype
    if (fileType !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        cleanUploadDirectory()
        return res.status(400).json({message: "files must be be of type .xlsx"})
    }

    const filePath = req.file.path

    const pythonProcess = await spawnSync('python', [
        'DataProcessing/mock_xlsx_reader.py',
        'main',
        filePath
    ]);

    const result = pythonProcess.stdout?.toString()?.trim();
    const error = pythonProcess.stderr?.toString()?.trim();

    if (error) {
        console.error(error)
        return res.status(500).json({message: "internal server error"})
    }

    res.json({"message": "File upload successful"})

    cleanUploadDirectory()

})

module.exports = router