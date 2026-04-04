const express = require("express")
const router = express.Router()

const { getNearbyDoctorsController } = require("../controllers/doctorController")
const authMiddleware = require("../middlewares/authMiddleware")

router.get("/nearby",authMiddleware,getNearbyDoctorsController)

module.exports = router