const multer = require("multer")

const storage = multer.diskStorage({

  destination: function(req, file, cb){
    cb(null, "uploads/")
  },

  filename: function(req, file, cb){
    const uniqueName = Date.now() + "-" + file.originalname
    cb(null, uniqueName)
  }
})

const fileFilter = (req,file,cb)=>{

  const allowedTypes = ["image/jpeg","image/png","image/jpg"]

  if(allowedTypes.includes(file.mimetype)){
    cb(null,true)
  }
  else{
    cb(new Error("Incorrect file format"),false)
  }

}
const upload = multer({ 
  storage,
  fileFilter
})

module.exports = upload