const mongoose = require("mongoose")

const doctorSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },
  specialization: {
    type: String,
    default: "Dermatologist"
  },
  hospital: {
    type: String
  },
  experience: {
    type: Number   // years
  },
  rating: {
    type: Number,
    default: 4
  },
  phone: {
    type: String
  },
  location:{
    type:{
      type:String,
      enum:["Point"],
      default:"Point"
    },

    coordinates:{
      type:[Number],   // [longitude, latitude]
      required:true
    },
    address:{
      type:String
    }
  }
},{timestamps:true})

doctorSchema.index({ location:"2dsphere" })
module.exports = mongoose.model("Doctor",doctorSchema)