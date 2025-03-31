import express from "express";
import passport from "passport";
import {
  createLearningAssessment,
  submitAssessmentQuiz,
  getClassroomAssessments,
  getStudentAssessmentAttempts,
} from "../controllers/assessmentController.js";

const router = express.Router();

// Teacher: Create a learning assessment
router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  createLearningAssessment,
);

// Student: Submit assessment answers
router.post(
  "/submit/:assessmentId",
  passport.authenticate("jwt", { session: false }),
  submitAssessmentQuiz,
);

// Get assessments for a classroom
router.get(
  "/classroom/:classcode",
  passport.authenticate("jwt", { session: false }),
  getClassroomAssessments,
);

// Get student’s assessment records
router.get(
  "/student/records",
  passport.authenticate("jwt", { session: false }),
  getStudentAssessmentAttempts,
);

export default router;
