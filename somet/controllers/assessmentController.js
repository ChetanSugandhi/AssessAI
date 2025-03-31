import LearningAssessment from "../models/Assessment.js";
import Student from "../models/Student.js";
import Classroom from "../models/Classroom.js";
import {
  generateMiniQuiz,
  gradeWritingResponse,
} from "../utils/gemini/quizGenerator.js";
import { generateStudentFeedback } from "../utils/gemini/feedback.js";

export const createLearningAssessment = async (req, res) => {
  const {
    classcode,
    title,
    videolink,
    audiolink,
    textlink,
    videodescription,
    audiodescription,
    textdescription,
  } = req.body;
  const teacherId = req.user._id;

  try {
    const classroom = await Classroom.findOne({ classroomCode: classcode });
    if (!classroom || classroom.teacher.toString() !== teacherId.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized or classroom not found" });
    }

    const videoContent = { link: videolink, description: videodescription };
    const audioContent = { link: audiolink, description: audiodescription };
    const textContent = { link: textlink, description: textdescription };

    const videoQuiz = await generateMiniQuiz(videoContent, "video");
    const audioQuiz = await generateMiniQuiz(audioContent, "audio");
    const textQuiz = await generateMiniQuiz(textContent, "text");

    const assessment = await LearningAssessment.create({
      classroom: classroom._id,
      title,
      videoContent,
      audioContent,
      textContent,
      videoQuiz,
      audioQuiz,
      textQuiz,
      createdBy: teacherId,
    });

    res.status(201).json({
      id: assessment._id,
      title: assessment.title,
      videoContent: assessment.videoContent,
      audioContent: assessment.audioContent,
      textContent: assessment.textContent,
      videoQuiz: assessment.videoQuiz.map((q) => ({
        type: q.type,
        question: q.question,
        options: q.options || undefined,
      })),
      audioQuiz: assessment.audioQuiz.map((q) => ({
        type: q.type,
        question: q.question,
        options: q.options || undefined,
      })),
      textQuiz: assessment.textQuiz.map((q) => ({
        type: q.type,
        question: q.question,
        options: q.options || undefined,
      })),
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create assessment: " + error.message });
  }
};

export const submitAssessmentQuiz = async (req, res) => {
  const { answers, quizType } = req.body; // quizType: "video", "audio", or "text"
  const { assessmentId } = req.params;
  const studentId = req.user._id;

  try {
    const assessment = await LearningAssessment.findById(assessmentId);
    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }

    const classroom = await Classroom.findById(assessment.classroom);
    if (!classroom.students.includes(studentId)) {
      return res
        .status(403)
        .json({ message: "You are not enrolled in this classroom" });
    }

    const quizMap = {
      video: assessment.videoQuiz,
      audio: assessment.audioQuiz,
      text: assessment.textQuiz,
    };
    const quiz = quizMap[quizType];
    if (!quiz) {
      return res.status(400).json({ message: "Invalid quiz type" });
    }

    let score = 0;
    const totalQuestions = quiz.length;
    const responses = [];

    for (const [index, answer] of Object.entries(answers)) {
      const questionIndex = parseInt(index);
      const question = quiz[questionIndex];
      let feedback = null;
      let questionScore = 0;

      if (question.type === "mcq") {
        if (answer === question.correctAnswer) {
          questionScore = 10;
          feedback = "Correct answer.";
        } else {
          feedback = `Incorrect. The correct answer is ${question.correctAnswer}.`;
        }
      } else if (question.type === "writing") {
        const grading = await gradeWritingResponse(question.question, answer);
        questionScore = grading.score;
        feedback = grading.explanation;
      }

      score += questionScore;
      responses.push({
        questionIndex,
        answer,
        feedback,
      });
    }

    const percentageScore = (score / (totalQuestions * 10)) * 100;

    const student = await Student.findById(studentId);
    let attempt = student.assessmentAttempts.find(
      (a) => a.assessmentId.toString() === assessmentId.toString(),
    );

    if (!attempt) {
      attempt = {
        assessmentId,
        classroomId: assessment.classroom,
        responsesByType: {},
        scoresByType: { video: 0, audio: 0, text: 0 },
        attemptedDate: new Date(),
      };
      student.assessmentAttempts.push(attempt);
    }

    attempt.responsesByType[quizType] = responses;
    attempt.scoresByType[quizType] = percentageScore;

    const allQuizzesAttempted = Object.keys(attempt.scoresByType).length === 3;
    if (allQuizzesAttempted) {
      attempt.score = (
        (attempt.scoresByType.video +
          attempt.scoresByType.audio +
          attempt.scoresByType.text) /
        3
      ).toFixed(2);
    }

    const assignmentFeedbacks = student.assignmentAttempts.flatMap((attempt) =>
      attempt.responses.map((r) => ({
        question: r.questionIndex,
        feedback: r.feedback,
        score: attempt.score,
      })),
    );
    const assessmentFeedbacks = student.assessmentAttempts.flatMap(
      (attempt) => {
        const feedbacks = [];
        for (const [type, responses] of Object.entries(
          attempt.responsesByType || {},
        )) {
          responses.forEach((r) =>
            feedbacks.push({
              question: r.questionIndex,
              feedback: r.feedback,
              contentType: type,
              score: attempt.scoresByType[type],
            }),
          );
        }
        return feedbacks;
      },
    );
    const feedbackResult = await generateStudentFeedback(
      assignmentFeedbacks,
      assessmentFeedbacks,
    );

    student.feedback = {
      detailed: feedbackResult.feedback,
      summary: feedbackResult.summary,
      generatedAt: new Date(),
    };

    await student.save();

    res.json({
      assessmentId,
      quizType,
      score: percentageScore,
      totalScorePossible: totalQuestions * 10,
      responses: responses.map((r) => ({
        questionIndex: r.questionIndex,
        answer: r.answer,
        feedback: r.feedback,
      })),
      overallScore: attempt.score || "Pending all quizzes",
      studentFeedback: student.feedback,
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
    const assessments = await LearningAssessment.find({
      classroom: classroom._id,
    })
      .populate("createdBy", "name email")
      .lean();

    const now = new Date();

    const processedAssessments = assessments.map((assessment) => {
      const assessmentCopy = { ...assessment };

      if (assessment.dueDate && new Date(assessment.dueDate) > now) {
        ["videoQuiz", "audioQuiz", "textQuiz"].forEach((quizType) => {
          if (assessmentCopy[quizType] && assessmentCopy[quizType].length > 0) {
            assessmentCopy[quizType] = assessmentCopy[quizType].map(
              (question) => {
                if (question.type === "mcq") {
                  const { correctAnswer, ...rest } = question;
                  return rest;
                }
                return question;
              },
            );
          }
        });
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
    const student = await Student.findById(studentId).select(
      "assessmentAttempts feedback",
    );
    const attempts = await Promise.all(
      student.assessmentAttempts.map(async (attempt) => {
        const assessment = await LearningAssessment.findById(
          attempt.assessmentId,
        ).select("title");
        return {
          assessmentId: attempt.assessmentId,
          title: assessment?.title || "Unknown",
          classroomId: attempt.classroomId,
          score: attempt.score || "Pending all quizzes",
          scoresByType: attempt.scoresByType,
          responsesByType: attempt.responsesByType,
          attemptedDate: attempt.attemptedDate,
        };
      }),
    );

    res.json({
      attempts,
      feedback: student.feedback || {
        detailed: "No feedback yet",
        summary: "N/A",
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
