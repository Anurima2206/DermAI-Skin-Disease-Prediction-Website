const express =require("express");
const { registerController, loginController, forgotPasswordController } = require("../controllers/authController");
const router=express.Router();

//post register
router.post("/register",registerController);

//post login
router.post("/login",loginController);

//post forgotpass
router.post("/forgotpass",forgotPasswordController);
module.exports = router;