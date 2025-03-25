import jwt from "jsonwebtoken";
import Teacher from "../models/Teacher.js";
import Student from "../models/Student.js";

const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role: role }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// Teacher Signup
export const teacherSignup = async (req, res) => {
  const { email, password, name, username } = req.body;
  try {
    const teacherExists = await Teacher.findOne({ email });
    if (teacherExists)
      return res.status(400).json({ message: "Teacher already exists" });

    const teacherExistsUsername = await Teacher.findOne({ username });
    if (teacherExistsUsername)
      return res.status(400).json({ message: "Username already exists" });

    await Teacher.create({ email, password, name, username });
    res.status(201).json({ message: "Teacher account created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Teacher Login
export const teacherLogin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const teacher = await Teacher.findOne({ username });
    if (!teacher || !(await teacher.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = generateToken(teacher._id, "teacher");
    res.json({ token, role: "teacher" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Student Signup
export const studentSignup = async (req, res) => {
  const { email, password, name, username } = req.body;
  try {
    const studentExists = await Student.findOne({ email });
    if (studentExists)
      return res.status(400).json({ message: "Student already exists" });

    const usernameExists = await Student.findOne({ username });
    if (usernameExists)
      return res.status(400).json({ message: "Username already exists" });

    await Student.create({ email, password, name, username });
    res.status(201).json({ message: "Student account created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Student Login
export const studentLogin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const student = await Student.findOne({ username });
    if (!student || !(await student.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = generateToken(student._id, "student");
    res.json({ token, role: "student" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
