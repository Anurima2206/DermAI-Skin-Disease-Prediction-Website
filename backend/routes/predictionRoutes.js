const express = require("express")
const router = express.Router()
const upload = require("../middlewares/uploadMiddleware")
const { predictDiseaseController, predictionHistoryController, predictionDetailsController, downloadReportController } = require("../controllers/predictionController")
const authMiddleware = require("../middlewares/authMiddleware")

router.post("/predictdisease",authMiddleware,upload.single("image"), predictDiseaseController)
router.get("/predicthistory",authMiddleware,predictionHistoryController)
router.get("/predictdetails/:id",authMiddleware,predictionDetailsController)
router.get("/pdf/:id",authMiddleware,downloadReportController)

module.exports = router