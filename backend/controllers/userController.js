const userModel=require("../models/userModel");
const bcrypt = require("bcryptjs");

//get info
const getUserController = async (req, res) => {
  try {
    // find user
    const user = await userModel.findById({ _id: req.user.id });
    //validation
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User Not Found",
      });
    }
    user.password = undefined;
    //resp
    res.status(200).send({
      success: true,
      message: "User found Successfully",
      user,
    });
  }
  catch(error){
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Eror in Get User API",
      error,
    });
  }
};

//update info
const updateUserController = async (req, res) => {
  try {
    // find user
    const user = await userModel.findById(req.user.id );
    //validation
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "user not found",
      });
    }
    //update
    const { username, location, phone,answer } = req.body;
    if (username) user.username = username;
    if (location !== undefined) {
    user.location.address = location;
    }
    if (phone){
      if (phone.length!=10) {
      return res.status(400).send({
        success: false,
        message: "Please Provide valid phone number",
      });
    }
    user.phone = phone;
  }
    if (answer){
    var salt = bcrypt.genSaltSync(10);
    const hashedans= await bcrypt.hash(answer, salt);
    user.answer = hashedans;
    }
    //save user
    await user.save();
    res.status(200).send({
      success: true,
      message: "User Updated Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Udpate User API",
      error,
    });
  }
};

//reset password
const updatePasswordController = async (req, res) => {
  try {
    const user = await userModel.findById({_id:req.user.id});
    if(!user){
      res.status(404).send({
      success: false,
      message: "user not found",
      });
    }
    const {oldPassword,newPassword}=req.body
    if(!oldPassword||!newPassword){
      res.status(400).send({
      success: false,
      message: "missing fields",
    });
    }
    const isMatch= await bcrypt.compare(oldPassword,user.password)
        if(!isMatch){
          return res.status(500).send({
            success:false,
            message:"Invalid credentials"
          })
        }
      //hashing password
    var salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await user.save();
    res.status(200).send({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error in password update upi",
      error,
    });
  }
}

const deleteProfileController = async (req, res) => {
  try {
    const user=await userModel.findByIdAndDelete(req.user.id);
  if (!user) {
    return res.status(404).send({
    success:false,
    message:"User not found"
  })
}
    return res.status(200).send({
      success: true,
      message: "Your account has been deleted",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Delete Profile API",
      error,
    });
  }
};
module.exports={getUserController,updateUserController,updatePasswordController,deleteProfileController};