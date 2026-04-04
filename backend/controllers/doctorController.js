const Doctor = require("../models/doctorModel")
const User = require("../models/userModel")


const getNearbyDoctorsController = async (req,res)=>{
  try{

    const user = await User.findById(req.user.id)

    if(!user || !user.location){
      return res.status(400).send({
        success:false,
        message:"User location not available"
      })
    }

    const latitude = user.location.latitude
    const longitude = user.location.longitude

    const doctors = await Doctor.aggregate([
    {
    $geoNear:{
      near:{
        type:"Point",
        coordinates:[longitude, latitude]
      },
      distanceField:"distance",
      maxDistance:5000,
      spherical:true
    }
    }
    ])

    res.send({
      success:true,
      doctors
    })

  }catch(error){

    console.log(error)

    res.status(500).send({
      success:false,
      message:"Error fetching doctors"
    })

  }
}
module.exports = {
  getNearbyDoctorsController
}