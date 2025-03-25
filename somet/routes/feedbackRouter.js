import express from "express";
import passport from "passport";
import {
  submitFeedback,
  getStudentFeedback,
  generateClassroomSummary,
} from "../controllers/feedbackController.js";

const router = express.Router();

router.post(
  "/submit",
  passport.authenticate("jwt", { session: false }),
  submitFeedback,
);
router.get(
  "/student/:studentId",
  passport.authenticate("jwt", { session: false }),
  getStudentFeedback,
);
router.get(
  "/classroom/:classroomId/summary",
  passport.authenticate("jwt", { session: false }),
  generateClassroomSummary,
);

export default router;
