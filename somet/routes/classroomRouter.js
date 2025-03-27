import express from "express";
import passport from "passport";
import {
  createClassroom,
  getClassroomDetails,
  joinClassroom,
  generateClassFeedback,
} from "../controllers/classroomController.js";

const router = express.Router();

router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  createClassroom,
);

router.post(
  "/join",
  passport.authenticate("jwt", { session: false }),
  joinClassroom,
);

router.get(
  "/:classcode",
  passport.authenticate("jwt", { session: false }),
  getClassroomDetails,
);

router.post(
  "/:classcode/feedback",
  passport.authenticate("jwt", { session: false }),
  generateClassFeedback,
);

export default router;
