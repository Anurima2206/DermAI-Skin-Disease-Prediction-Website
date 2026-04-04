const predictionModel=require("../models/predictionModel");
const MedicalHistory = require("../models/medicalModel")
const axios = require("axios");
const generatePDF = require("../utils/pdfGenerator");
const FormData = require("form-data");
const fs = require("fs");

//disease prediction
const predictDiseaseController = async(req,res)=>{
try {
  if(!req.file){
      return res.status(400).json({
        success:false,
        message:"Incorrect file format. Please upload JPG, JPEG or PNG."
      })
    }
    const imagePath = req.file.path

    const medicalHistory = await MedicalHistory.findOne({
    userId:req.user.id
    })

    //default values
    let age = 25
    let symptoms = "None"
    let allergies = "None"
    let gender = "None"
    let skinType = "None"
        
    if(medicalHistory){
      
      age = medicalHistory.age ? Number(medicalHistory.age) : 25;
      gender= medicalHistory.gender || "None";
      skinType= medicalHistory.skinType || "None";
      symptoms= medicalHistory.symptoms?.length ? medicalHistory.symptoms.join(", "): "None";
      allergies = medicalHistory.allergies?.length ? medicalHistory.allergies.join(", "): "None";
    }
     
    const formData = new FormData()
    formData.append("image", fs.createReadStream(imagePath))
    formData.append("symptoms", symptoms)
    formData.append("age", age)
    formData.append("allergies", allergies)
    formData.append("gender", gender)
    formData.append("skinType", skinType)

    const mlResponse = await axios.post(
      process.env.ML_API_URL,
      formData,
      {
        headers: formData.getHeaders()
      }
    )

      const disease = mlResponse.data.prediction_class
      const confidence = mlResponse.data.confidence
      const advice = mlResponse.data.ai_explanation.toString().replace(/\*\*/g, "");

      const prediction = new predictionModel({
      userId: req.user.id,
      image: imagePath,
      disease,
      confidence,
      advice
    })

    await prediction.save()

    res.json({
  success:true,
  predictionId: prediction._id,
  prediction_class: disease,
  confidence: confidence,
  ai_explanation: advice
  })

} catch (error) {
    console.error("Prediction controller error:", error);
    res.status(500).send({
      success: false,
      message: "Error In predict disease API",
      error,
    });
}
}

//prediction history
const predictionHistoryController = async (req, res) => {
  try {
    const predictions = await predictionModel.find({userId: req.user.id}).sort
  ({ createdAt: -1 });
   if (!predictions) {
      return res.status(404).json({
        success: false,
        message: "Prediction not found or unauthorized"
      })
    }
    res.json(predictions)
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error in get prediction api",
      error,
    });
  }
}

//prediction details by ID
const predictionDetailsController = async (req,res) =>{
  try {
    const prediction=await predictionModel.findOne({
      _id:req.params.id,
      userId:req.user.id
  })
  if (!prediction) {
      return res.status(404).json({
        success: false,
        message: "Prediction not found or unauthorized"
      })
    }
    res.json(prediction)
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success:false,
      message:"error in prediction details api"
    })
  }
}

//download pdf
const downloadReportController = async(req,res)=>{
  try {
  const prediction = await predictionModel.findOne({
    _id:req.params.id,
    userId:req.user.id
  })
  if(!prediction){
      return res.status(404).json({
      success: false,
      message: "Prediction not found or unauthorized"
      })
    }

    /* fetch medical history */
    const medicalHistory = await MedicalHistory.findOne({
    userId:req.user.id
    })
  generatePDF(prediction,medicalHistory || {},res);
  
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success:false,
      message:"error in pdf generate api"
    })
  }
}
module.exports={predictDiseaseController,predictionHistoryController,predictionDetailsController,downloadReportController};