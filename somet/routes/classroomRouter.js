import express from "express";
import passport from "passport";
import {
  createClassroom,
  getClassroomDetails,
  joinClassroom,
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

export default router;
