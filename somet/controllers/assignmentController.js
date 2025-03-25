import Assignment from "../models/Assignment.js";
import Classroom from "../models/Classroom.js";
import Student from "../models/Student.js";
import { generateQuiz } from "../utils/gemini/quizGenerator.js";

export const createAssignment = async (req, res) => {
  const { classroomId, title, description, dueDate } = req.body;
  const teacherId = req.user._id;

  try {
    const classroom = await Classroom.findById(classroomId);
    if (!classroom || classroom.teacher.toString() !== teacherId.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized or classroom not found" });
    }

    const assignment = await Assignment.create({
      classroom: classroomId,
      title,
      description,
      type: "regular",
      createdBy: teacherId,
      dueDate: dueDate || null,
    });

    res.status(201).json({
      id: assignment._id,
      title: assignment.title,
      description: assignment.description,
      type: assignment.type,
      dueDate: assignment.dueDate,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const createQuizAssignment = async (req, res) => {
  const { title, description } = req.body;
  const { classcode } = req.params;
  const teacherId = req.user._id;

  const dueDate = new Date();
  dueDate.setUTCDate(dueDate.getUTCDate() + 1);
  dueDate.setUTCHours(23, 59, 59, 999);

  try {
    const classroom = await Classroom.findOne({ classroomCode: classcode });
    if (!classroom || classroom.teacher.toString() !== teacherId.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized or classroom not found" });
    }

    const quizContent = await generateQuiz(title, description);

    const assignment = await Assignment.create({
      classroom: classroom._id,
      title,
      description,
      type: "quiz",
      createdBy: teacherId,
      quizContent,
      dueDate,
    });

    res.status(201).json({
      id: assignment._id,
      title: assignment.title,
      description: assignment.description,
      type: assignment.type,
      quizContent: assignment.quizContent,
      dueDate: assignment.dueDate,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create quiz assignment: " + error.message });
  }
};

export const getClassroomAssignments = async (req, res) => {
  const { classcode } = req.params;

  try {
    // Find classroom
    const classroom = await Classroom.findOne({ classroomCode: classcode }).select("_id");
    if (!classroom) {
      return res.status(404).json({ message: "Classroom not found" });
    }

    // Find assignments and properly convert to plain objects
    const assignments = await Assignment.find({ classroom: classroom._id })
      .lean(); // Convert Mongoose documents to plain JS objects

    // Process assignments
    const processedAssignments = assignments.map(assignment => {
      // Check if due date has passed
      const isPastDue = assignment.dueDate && new Date(assignment.dueDate) < new Date();
      
      // If it's a quiz and due date hasn't passed, remove correct answers
      if (assignment.type === 'quiz' && !isPastDue && assignment.quizContent) {
        assignment.quizContent = assignment.quizContent.map(question => {
          const { correctAnswer, ...rest } = question;
          return rest;
        });
      }
      
      return assignment;
    });

    res.json(processedAssignments);
  } catch (error) {
    console.error("Error fetching assignments:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const attemptQuizAssignment = async (req, res) => {
  const { assignmentId } = req.params;
  const { answers } = req.body; // Expects { "1": "A", "2": "B", ... } (questionIndex -> selectedOption)
  const studentId = req.user._id;

  try {
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment || assignment.type !== "quiz") {
      return res.status(404).json({ message: "Quiz assignment not found" });
    }

    const student = await Student.findById(studentId);
    if (!student.classrooms.includes(assignment.classroom)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    let score = 0;
    assignment.quizContent.forEach((question, index) => {
      if (answers[index] && answers[index] === question.correctAnswer) {
        score++;
      }
    });

    student.assignmentAttempts.push({
      assignmentId,
      classroomId: assignment.classroom,
      attemptedDate: new Date(),
      score,
    });

    await student.save();

    res.status(200).json({
      message: "Quiz submitted successfully",
      score,
      totalQuestions: assignment.quizContent.length,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to submit quiz: " + error.message });
  }
};
