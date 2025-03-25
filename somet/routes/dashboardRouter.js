import express from "express";
import passport from "passport";
import {
  getTeacherDashboard,
  getStudentDashboard,
} from "../controllers/dashboardController.js";

const router = express.Router();

router.get(
  "/teacher-dashboard",
  passport.authenticate("jwt", { session: false }),
  getTeacherDashboard,
);

router.get(
  "/student-dashboard",
  passport.authenticate("jwt", { session: false }),
  getStudentDashboard,
);

export default router;
