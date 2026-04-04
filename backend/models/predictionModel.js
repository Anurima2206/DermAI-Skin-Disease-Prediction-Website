const mongoose = require("mongoose")

const predictionSchema = new mongoose.Schema(
{
   userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:[true,"user id is rqd"]
 },

  image:{
  type:String,
  required:[true,"image is rqd"]
 },
disease:{
  type:String
 },

 confidence:{
  type:Number
 },

 advice:{
  type:String
 },

 createdAt:{
  type:Date,
  default:Date.now
}
})
module.exports = mongoose.model("Prediction", predictionSchema)