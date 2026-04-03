const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"))

/* ensure uploads folder exists (important for Render deployment) */
const uploadPath = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}
app.get("/", (req, res) => {
  res.send("API is running...");
});

//routes
app.use('/api/v1/auth',require("./routes/authRoutes.js"));
app.use('/api/v1/user',require("./routes/userRoutes.js"));
app.use('/api/v1/predict',require("./routes/predictionRoutes.js"));
app.use('/api/v1/doctor',require("./routes/doctorRoutes.js"));
app.use('/api/v1/feedback',require("./routes/feedbackRoutes.js"));
app.use('/api/v1/medical',require("./routes/medicalRoutes.js"));
/* serve uploaded images */
app.use("/uploads", express.static(uploadPath));
module.exports = app;