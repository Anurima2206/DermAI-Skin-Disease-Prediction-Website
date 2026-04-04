const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./config/db");
const app = require("./app");


const PORT=process.env.PORT||5000;

const startServer = async()=>{
    try {
        await connectDB();
        
        app.listen(PORT, ()=>{
            console.log(`Port number is:${PORT}`)
        });
    } catch (error) {
       console.log("MongoDB connection failed!!",error);
    }
};
startServer();