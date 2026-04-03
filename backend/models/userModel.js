const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
{
  username:{
    type: String,
    required: [true, "username is required"],
  },

  email: {
    type: String,
    required: [true, "email is required"],
    unique: true
  },
  password: {
    type: String
  },
  phone: {
    type: String
  },
  location:{
  address:String,
  latitude:Number,
  longitude:Number
},
  answer: {
      type: String,
      required: [true, "Asnwer is required"],
  }
},
{ timestamps: true }
)

module.exports = mongoose.model("User", userSchema)