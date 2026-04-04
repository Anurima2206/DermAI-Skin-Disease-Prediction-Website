const express = require("express")
const router = express.Router()

const authMiddleware = require("../middlewares/authMiddleware")

const { submitFeedbackController } = require("../controllers/feedbackController")

router.post("/submit",authMiddleware,submitFeedbackController)

module.exports = router