const predictionModel=require("../models/predictionModel");
const axios = require("axios");
const generatePDF = require("../utils/pdfGenerator");

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
    // Fake ML response
        const disease = "Melanositic Navi"
        const confidence = 0.42
        const advice = "Go to doctor asap"

    const prediction = new predictionModel({
      userId: req.user.id,
      image: imagePath,
      disease,
      confidence,
      advice
    })

    await prediction.save()
    res.json({
      disease,
      confidence,
      advice
    })
} catch (error) {
    console.log(error);
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
  ({ createdAt: -1 })
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
  generatePDF(prediction,res);
  
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success:false,
      message:"error in pdf generate api"
    })
  }
}
module.exports={predictDiseaseController,predictionHistoryController,predictionDetailsController,downloadReportController};