const express = require("express")
const router = express.Router()

const authMiddleware = require("../middlewares/authMiddleware")

const {
  createMedicalHistoryController,
  getMedicalHistoryController,
  updateMedicalHistoryController
} = require("../controllers/medicalController")

// create profile
router.post("/create",authMiddleware,createMedicalHistoryController)

// get profile
router.get("/get",authMiddleware,getMedicalHistoryController)

// update profile
router.put("/update",authMiddleware,updateMedicalHistoryController)

module.exports = router