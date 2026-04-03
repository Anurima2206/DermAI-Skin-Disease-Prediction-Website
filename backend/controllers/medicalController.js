const MedicalHistory = require("../models/medicalModel")
//create 
const createMedicalHistoryController = async(req,res)=>{
  try{
    const existing = await MedicalHistory.findOne({
      userId:req.user.id
    })

    if(existing){
      return res.status(400).send({
        success:false,
        message:"Medical profile already exists"
      })
    }

    const history = new MedicalHistory({
      ...req.body,
      allergies: req.body.allergies ? [req.body.allergies] : [],
      symptoms: req.body.symptoms ? [req.body.symptoms] : [],
      userId:req.user.id
    })

    await history.save()

    res.status(201).send({
      success:true,
      message:"Medical history created successfully",
      history
    })
  }catch(error){
    console.log(error)
    res.status(500).send({
      success:false,
      message:"Error creating medical history",
      error
    })
  }
}

//get
const getMedicalHistoryController = async(req,res)=>{
  try{
    const history = await MedicalHistory.findOne({
      userId:req.user.id
    })

    res.send({
      success:true,
      history
    })
  }catch(error){
    console.log(error)
    res.status(500).send({
      success:false,
      message:"Error fetching medical history",
      error
    })
  }
}

//update
const updateMedicalHistoryController = async (req, res) => {
  try {

    const updateData = {}

    if (req.body.age) updateData.age = req.body.age
    if (req.body.gender) updateData.gender = req.body.gender
    if (req.body.skinType) updateData.skinType = req.body.skinType

    if (req.body.allergies) {
      updateData.allergies = [req.body.allergies]
    }

    if (req.body.symptoms) {
      updateData.symptoms = [req.body.symptoms]
    }

    const history = await MedicalHistory.findOneAndUpdate(
      { userId: req.user.id },
      { $set: updateData },
      { new: true }
    )

    if (!history) {
      return res.status(404).send({
        success: false,
        message: "Medical profile not found"
      })
    }

    res.status(200).send({
      success: true,
      message: "Medical history updated",
      history
    })

  } catch (error) {
    console.log(error)

    res.status(500).send({
      success: false,
      message: "Error updating medical history",
      error
    })
  }
}
module.exports={createMedicalHistoryController,getMedicalHistoryController,updateMedicalHistoryController}