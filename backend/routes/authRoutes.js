const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Teacher = require("../Models/teacher");
const jwtConfig = require("../config/jwt");

router.post("/teacher-signup", async (req, res) => {
  const { name, email, username, password } = req.body;

  if (!name || !email || !username || !password) {
    return res.status(400).json({ error: "Name, email, username, and password are required" });
  }

  try {
    const existingTeacher = await Teacher.findOne({ $or: [{ email }, { username }] });
    if (existingTeacher) {
      if (existingTeacher.email === email) {
        return res.status(400).json({ error: "Email already in use" });
      }
      if (existingTeacher.username === username) {
        return res.status(400).json({ error: "Username already taken" });
      }
    }

    const teacher = new Teacher({ name, email, username, password });
    await teacher.save();

    res.status(201).json({ message: "Teacher registered successfully" });
      console.log("teacher registered")
  } catch (error) {
    console.error("Error registering teacher:", error.message);
    res.status(500).json({ error: "Failed to register teacher" });
  }
});

router.post("/teacher-login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "username and password are required" });
  }

  try {
    const teacher = await Teacher.findOne({ username });
    if (!teacher || !(await teacher.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: teacher._id }, jwtConfig.secret, {
      expiresIn: jwtConfig.expiresIn,
    });

    res.json({ token, teacher: { id: teacher._id, email: teacher.email, name: teacher.name, username } });
      console.log("logged in teacher")
  } catch (error) {
    res.status(500).json({ error: "Failed to login" });
  }
});

module.exports = router;
