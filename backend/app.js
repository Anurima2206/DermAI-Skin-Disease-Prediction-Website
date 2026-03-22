const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running...");
});

//routes
app.use('/api/v1/auth',require("./routes/authRoutes.js"));
app.use('/api/v1/user',require("./routes/userRoutes.js"));
module.exports = app;