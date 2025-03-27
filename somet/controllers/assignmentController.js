// controllers/assignmentController.js
import Assignment from "../models/Assignment.js";
import Classroom from "../models/Classroom.js";
import Student from "../models/Student.js";
import { generateQuiz, gradeWritingResponse } from "../utils/gemini/quizGenerator.js";

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
      return res.status(403).json({ message: "Unauthorized or classroom not found" });
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
      quizContent: assignment.quizContent.map(q => ({
        type: q.type,
        question: q.question,
        options: q.options || undefined,
      })),
      dueDate: assignment.dueDate,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create quiz assignment: " + error.message });
  }
};

export const getClassroomAssignments = async (req, res) => {
  const { classcode } = req.params;

  try {
    const classroom = await Classroom.findOne({ classroomCode: classcode }).select("_id");
    if (!classroom) {
      return res.status(404).json({ message: "Classroom not found" });
    }

    const assignments = await Assignment.find({ classroom: classroom._id }).lean();

    const processedAssignments = assignments.map(assignment => {
      const isPastDue = assignment.dueDate && new Date(assignment.dueDate) < new Date();
      
      if (assignment.type === "quiz" && !isPastDue && assignment.quizContent) {
        assignment.quizContent = assignment.quizContent.map(question => {
          if (question.type === "mcq") {
            const { correctAnswer, ...rest } = question;
            return rest;
          }
          return question;
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
  const { answers } = req.body; // Expects { "0": "A", "1": "Student's paragraph text", ... }
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
    const totalQuestions = assignment.quizContent.length;
    const responses = [];

    for (const [index, answer] of Object.entries(answers)) {
      const questionIndex = parseInt(index);
      const question = assignment.quizContent[questionIndex];
      let feedback = null;

      if (question.type === "mcq") {
        if (answer === question.correctAnswer) {
          score += 10; // 10 points per correct MCQ
          feedback = "Correct answer.";
        } else {
          feedback = `Incorrect. The correct answer is ${question.correctAnswer}.`;
        }
      } else if (question.type === "writing") {
        const grading = await gradeWritingResponse(question.question, answer);
        score += grading.score; // Gemini-graded score out of 10
        feedback = grading.explanation;
      }

      responses.push({
        questionIndex,
        answer,
        feedback,
      });
    }

    const percentageScore = (score / (totalQuestions * 10)) * 100;

    student.assignmentAttempts.push({
      assignmentId,
      classroomId: assignment.classroom,
      responses,
      score: percentageScore,
    });

    await student.save();

    res.status(200).json({
      message: "Quiz submitted successfully",
      score: percentageScore,
      totalScorePossible: totalQuestions * 10,
      responses: responses.map(r => ({
        questionIndex: r.questionIndex,
        answer: r.answer,
        feedback: r.feedback,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to submit quiz: " + error.message });
  }
};
