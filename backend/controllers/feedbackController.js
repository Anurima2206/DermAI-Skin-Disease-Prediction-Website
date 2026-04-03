const Feedback = require("../models/feedbackModel")

const submitFeedbackController = async(req,res)=>{
  try{
    const {rating,comment} = req.body

    const feedback = new Feedback({
      userId:req.user.id,
      rating,
      comment
    })

    await feedback.save()

    res.send({
      success:true,
      message:"Feedback submitted successfully"
    })

  }catch(error){

    console.log(error)

    res.status(500).send({
      success:false,
      message:"Error submitting feedback",
      error
    })

  }
}

module.exports = {
  submitFeedbackController
}