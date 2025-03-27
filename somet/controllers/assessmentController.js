// controllers/assessmentController.js
import LearningAssessment from "../models/Assessment.js";
import Student from "../models/Student.js";
import Classroom from "../models/Classroom.js";
import { generateMiniQuiz, gradeWritingResponse } from "../utils/gemini/quizGenerator.js";

export const createLearningAssessment = async (req, res) => {
  const { classcode, title, contentType, contentUrlOrText, quizDescription } = req.body;
  const teacherId = req.user._id;

  try {
    const classroom = await Classroom.findOne({ classroomCode: classcode });
    if (!classroom || classroom.teacher.toString() !== teacherId.toString()) {
      return res.status(403).json({ message: "Unauthorized or classroom not found" });
    }

    const quiz = await generateMiniQuiz(contentUrlOrText, quizDescription);

    const assessment = await LearningAssessment.create({
      classroom: classroom._id,
      title,
      content: { type: contentType, urlOrText: contentUrlOrText },
      quiz,
      createdBy: teacherId,
    });

    res.status(201).json({
      id: assessment._id,
      title: assessment.title,
      content: assessment.content,
      quiz: assessment.quiz.map(q => ({
        type: q.type,
        question: q.question,
        options: q.options || undefined,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create assessment: " + error.message });
  }
};

export const submitAssessment = async (req, res) => {
  const { answers } = req.body; // Expects { "0": "B", "1": "Student's paragraph text", ... }
  const { assessmentId } = req.params;
  const studentId = req.user._id;

  try {
    const assessment = await LearningAssessment.findById(assessmentId);
    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }

    const classroom = await Classroom.findById(assessment.classroom);
    if (!classroom.students.includes(studentId)) {
      return res.status(403).json({ message: "You are not enrolled in this classroom" });
    }

    let score = 0;
    const totalQuestions = assessment.quiz.length;
    const responses = [];

    for (const [index, answer] of Object.entries(answers)) {
      const questionIndex = parseInt(index);
      const question = assessment.quiz[questionIndex];
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

    const student = await Student.findById(studentId);
    student.assessmentAttempts.push({
      assessmentId,
      classroomId: assessment.classroom,
      responses,
      score: percentageScore,
    });
    await student.save();

    res.json({
      assessmentId,
      score: percentageScore,
      totalScorePossible: totalQuestions * 10,
      responses: responses.map(r => ({
        questionIndex: r.questionIndex,
        answer: r.answer,
        feedback: r.feedback,
      })),
      submittedAt: new Date(),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

export const getClassroomAssessments = async (req, res) => {
  const { classcode } = req.params;

  try {
    const classroom = await Classroom.findOne({ classroomCode: classcode });
    const assessments = await LearningAssessment.find({ classroom: classroom._id })
      .populate("createdBy", "name email")
      .lean();

    const now = new Date();

    const processedAssessments = assessments.map(assessment => {
      const assessmentCopy = { ...assessment };

      if (assessment.dueDate && new Date(assessment.dueDate) > now) {
        if (assessment.quiz && assessment.quiz.length > 0) {
          assessmentCopy.quiz = assessment.quiz.map(question => {
            if (question.type === "mcq") {
              const { correctAnswer, ...rest } = question;
              return rest;
            }
            return question;
          });
        }
      }

      return assessmentCopy;
    });

    res.json(processedAssessments);
  } catch (error) {
    console.error("Error fetching assessments:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getStudentAssessmentAttempts = async (req, res) => {
  const studentId = req.user._id;

  try {
    const student = await Student.findById(studentId).select("assessmentAttempts");
    const attempts = await Promise.all(
      student.assessmentAttempts.map(async attempt => {
        const assessment = await LearningAssessment.findById(attempt.assessmentId).select("title");
        return {
          assessmentId: attempt.assessmentId,
          title: assessment?.title || "Unknown",
          classroomId: attempt.classroomId,
          score: attempt.score,
          attemptedDate: attempt.attemptedDate,
          responses: attempt.responses.map(r => ({
            questionIndex: r.questionIndex,
            answer: r.answer,
            feedback: r.feedback,
          })),
        };
      })
    );

    res.json(attempts);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
