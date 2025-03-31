const express = require("express")
const multer = require("multer")
const { spawnSync } = require('child_process');
const path = require("path")
const fs = require("fs")
const Report = require("../models/Report")
const Company = require("../models/Company")

const router = express.Router()
router.use(express.json())



function saveReportToDb(jsonData) {
    Array.from(jsonData).forEach(async (jsonReport)=>{
        const newReport = new Report(jsonReport)
        await newReport.save()
    })
}

async function setCompanyIdForReports(jsonData) {

    /* The company_id attribute is first set to the company name in xlsx_reader.py
    and is now substituted by the actual company ID from MongoDB */
    jsonData = JSON.parse(jsonData)

    const reports = await Promise.all(jsonData.map(async (report)=>{
        const found_company = await Company.find({name: report.company_id})
        if(found_company) {
            const company = found_company[0]
            report.company_id = company._id
            return report
        }
    }))
    if (reports.length === 0) {
        return false
    }
    return reports

}

function validatePythonResult(result) {
    let counter = 1
    let errorMessage = undefined
    JSON.parse(result).forEach(reportJson=>{
        if (reportJson === "report contains invalid data") {
            // If one of the reports in the xlsx file is invalid, the position of it and an error message is returned
            errorMessage = `${counter}. report contains invalid data.`
            // Second report will return "2. report contains invalid data"
        }
        counter += 1
    })
    return errorMessage
}


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

    const fileName = req.file.filename
    const filePath = `uploads/${fileName}`

    const pythonProcess = await spawnSync('python', [
        'src/data_processing/xlsx_reader.py',
        'main',
        filePath
    ]);

    const result = pythonProcess.stdout?.toString()?.trim();
    const error = pythonProcess.stderr?.toString()?.trim();

    if (error) {
        console.error(error)
        return res.status(500).json({message: "internal server error"})
    }

    const errorMessage = validatePythonResult(result)
    if (errorMessage) {
        // If one report in the xlsx file is invalid, none of them are saved to the database and 400 is returned
        return res.status(400).json({message: errorMessage})
    }

    const reportJson = await setCompanyIdForReports(result)

    if (!reportJson) {
        return res.status(404).json({message: `company not found`})
    }

    saveReportToDb(reportJson)

    const reportCount = reportJson.length

    res.status(201).json({"message": `successfully saved ${reportCount} reports`})

    cleanUploadDirectory()

})

module.exports = router