import express from "express";
import {
  teacherSignup,
  teacherLogin,
  studentSignup,
  studentLogin,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/teacher-signup", teacherSignup);
router.post("/teacher-login", teacherLogin);
router.post("/student-signup", studentSignup);
router.post("/student-login", studentLogin);

export default router;
