const mongoose=require ("mongoose");
console.log("ENV:", process.env.MONGODB_URL);
const connectDB=async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log(`Connected to database ${mongoose.connection.host}`)
    } catch (error) {
        console.log("DB error",error.message)
        process.exit(1);
    }
}
module.exports=connectDB; 