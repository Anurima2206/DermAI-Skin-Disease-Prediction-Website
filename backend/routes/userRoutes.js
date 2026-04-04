const express =require("express");
const { getUserController, updateUserController, updatePasswordController, deleteProfileController } = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

const router=express.Router();

//get getuser
router.get("/getuser",authMiddleware,getUserController);

//post updateuser
router.post("/updateuser",authMiddleware,updateUserController);

//post updatepassword
router.post("/updatepass",authMiddleware,updatePasswordController);

//delete deleteprofile
router.delete("/deleteprofile",authMiddleware,deleteProfileController);

module.exports = router;