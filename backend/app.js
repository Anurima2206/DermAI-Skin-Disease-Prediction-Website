const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"))

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
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
module.exports = app;