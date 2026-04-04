const userModel = require("../models/userModel");
const bcrypt=require("bcryptjs");
const JWT=require('jsonwebtoken')

//Register
const registerController = async (req, res) => {
  try {
    const { username, email, password, phone, location,latitude,longitude,answer} = req.body;
    //validation
    if (!username || !email || !password || !answer || !location) {
      return res.status(400).send({
        success: false,
        message: "Please Provide All Fields",
      });
    }
    // check user
    const exisiting = await userModel.findOne({ email });
    if (exisiting) {
      return res.status(400).send({
        success: false,
        message: "Email Already Registerd please Login",
      });
    }
    //phone no
    if(phone){
    if (phone.length!=10) {
      return res.status(400).send({
        success: false,
        message: "Please Provide valid phone number",
      });
    }
  }

    //password
    if(password.length < 6){
      return res.status(400).send({
        success:false,
        message:"Password must be at least 6 characters"
    });
    }
    if(!/[A-Z]/.test(password)){
      return res.status(400).send({
        success:false,
        message:"Password must contain atleast one uppercase letter"
    });
  }
    if(!/[0-9]/.test(password)){
      return res.status(400).send({
        success:false,
        message:"Password must contain atleast one number"
    });
  }
    if(!/[!@#$%^&*]/.test(password)){
      return res.status(400).send({
        success:false,
        message:"Password must contain atleast one special character"
    });
  }

    //hashing password
    var salt=bcrypt.genSaltSync(10);
    const hashedpass=await bcrypt.hash(password,salt);

    //hashing answer
    var salt=bcrypt.genSaltSync(10);
    const hashedans=await bcrypt.hash(answer,salt);
    //create new user
    const user = await userModel.create({
      username,
      email,
      password:hashedpass,
      phone,
      location:{
        address:location,
        latitude,
        longitude
      },
      answer:hashedans
    });
    res.status(201).send({
      success: true,
      message: "Successfully Registered",
      user
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Register API",
      error:error.message,
    });
  }
};

//Login
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).send({
        success: false,
        message: "Please Provide Email Id",
      });
    }
    if (!password) {
      return res.status(400).send({
        success: false,
        message: "Please Provide password",
      });
    }
    //check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User Not Found",
      });
    }
    //compare password
    const isMatch=await bcrypt.compare(password,user.password)
    if(!isMatch){
      return res.status(500).send({
        success:false,
        message:"Invalid credentials"

      })
    }
    const token=JWT.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"8h"});
    user.password=undefined;
    res.status(200).send({
      success: true,
      message: "Login Successful",
      token,
      user,
    });
}
catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Login API",
      error:error.message,
    });
  }
}

//Forgot password
const forgotPasswordController = async (req, res) => {
  try {

    const { email, answer, newPassword } = req.body;

    // check missing fields
    if (!email || !answer || !newPassword) {
      return res.status(400).send({
        success: false,
        message: "Please provide email, security answer and new password",
      });
    }

    // find user
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // verify security answer
    const isMatch= await bcrypt.compare(answer,user.answer)
    if (!isMatch) {
      return res.status(401).send({
        success: false,
        message: "Invalid security answer",
      });
    }

    // password validation
    if (newPassword.length < 6) {
      return res.status(400).send({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    if (!/[A-Z]/.test(newPassword)) {
      return res.status(400).send({
        success: false,
        message: "Password must contain one capital letter",
      });
    }

    if (!/[0-9]/.test(newPassword)) {
      return res.status(400).send({
        success: false,
        message: "Password must contain one number",
      });
    }

    if (!/[!@#$%^&*]/.test(newPassword)) {
      return res.status(400).send({
        success: false,
        message: "Password must contain one special character",
      });
    }

    // hash password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // update password
    user.password = hashedPassword;

    await user.save();

    res.status(200).send({
      success: true,
      message: "Password reset successfully",
    });

  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in forgot password API",
      error,
    });
  }
};

module.exports = {registerController,loginController,forgotPasswordController};