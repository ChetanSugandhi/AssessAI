const express = require("express");
const mongoose = require("mongoose");
const passport = require("./config/passport");
const authRoutes = require("./routes/authRoutes");

const app = express();
require("dotenv").config();

app.use(express.json());
app.use(passport.initialize());

mongoose.connect(process.env.MONGO_URL);

// Routes
app.use("/api/auth", authRoutes);

app.listen(7777, () => console.log("Server running on port 7777"));
