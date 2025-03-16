const express = require("express");
const router = express.Router();
const Teacher = require("../Models/teacher");
const auth = require("../middleware/auth");
const ClassroomCreate = require("../Models/classroomCreate");

router.post("/create", auth, async (req, res) => {
  console.log(req.user);
  try {
    console.log("Is authenticated:", req.isAuthenticated());
    console.log("User object:", req.user);

    // Ensure the user is authenticated and is a teacher
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized: Please log in." });
    }

    const teacherId = req.user._id;

    // Check if the user is actually a teacher
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res
        .status(403)
        .json({ message: "Only teachers can create classrooms." });
    }

    const { name, subject, classroomCode, description } = req.body;

    const newClassroom = new ClassroomCreate({
      name,
      subject,
      classroomCode,
      description,
      teacherId,
    });

    const savedClassroom = await newClassroom.save();

    // Store classroom in the teacher's createdClassrooms array
    teacher.createdClassrooms.push(savedClassroom._id);
    await teacher.save();

    res
      .status(201)
      .json({
        message: "Classroom created successfully",
        classroom: savedClassroom,
      });
  } catch (error) {
    console.error("Classroom creation error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
