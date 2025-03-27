import express from "express";
import passport from "passport";
import {
  attemptQuizAssignment,
  createQuizAssignment,
  getClassroomAssignments,
} from "../controllers/assignmentController.js";

const router = express.Router();

// Teacher: Create a quiz assignment
router.post(
  "/:classcode/quiz",
  passport.authenticate("jwt", { session: false }),
  createQuizAssignment,
);

// Get all assignments for a classroom (accessible to both teacher and student)
router.get(
  "/:classcode",
  passport.authenticate("jwt", { session: false }),
  getClassroomAssignments,
);

router.post(
  "/attempt/:assignmentId",
  passport.authenticate("jwt", { session: false }),
  attemptQuizAssignment,
);

export default router;
