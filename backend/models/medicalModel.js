const mongoose = require("mongoose")

const medicalSchema = new mongoose.Schema({
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
    unique:true
  },
    age:{
      type:Number
    },
    gender:{
      type:String,
    },
    skinType:{
      type:String,
    },
    allergies:[
      {
        type:String,
      }
    ],
    symptoms:[
      {
        type:String
      }
    ],
  },
{timestamps:true})

module.exports = mongoose.model("Medical",medicalSchema)