const express = require("express");
const router = express.Router();
const Teacher = require("../Models/teacher");
const Student = require("../Models/student")
const auth = require("../middleware/auth");
const ClassroomCreate = require("../Models/classroomCreate");
const ClassroomJoin = require("../Models/classroomJoin")

router.post("/create", auth, async (req, res) => {
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

router.post("/join", auth, async (req, res) => {
  try {
    const studentId = req.user._id;

    const { classroomCode } = req.body;

    // Find the classroom using the provided code
    const classroom = await ClassroomCreate.findOne({ classroomCode });
    if (!classroom) {
      return res.status(404).json({ message: "Invalid classroom code" });
    }

    // Check if the student has already joined this classroom
    const existingEntry = await ClassroomJoin.findOne({
      studentId,
      classroomCode,
    });
    if (existingEntry) {
      return res
        .status(400)
        .json({ message: "You have already joined this classroom" });
    }

    const newClassroomJoin = new ClassroomJoin({
      studentId,
      subject: classroom.subject,
      classroomCode,
    });

    await newClassroomJoin.save();

    // Update Student Schema: Push Classroom ID to `joinedClassrooms`
    const student = await Student.findById(studentId);
    if (student) {
      student.joinedClassrooms.push(classroom._id);
      await student.save();
    }

    // ✅ Update Classroom Schema: Push Student ID to `joinedStudents`
    if (!ClassroomCreate.joinedStudents.includes(studentId)) {
      ClassroomCreate.joinedStudents.push(studentId);
      await classroom.save();
    }


    res.status(201).json({
      message: "Successfully joined the classroom",
      classroom: newClassroomJoin,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
