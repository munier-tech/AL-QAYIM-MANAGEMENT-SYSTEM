import express from "express";
import {
  createExam,
  getStudentExams,
  getClassExams,
  updateExam,
  deleteExam
} from "../controllers/examController.js";

import { protectedRoute } from "../middlewares/authorization.js";

const router = express.Router();

router.post("/create", protectedRoute, createExam);
router.get("/student/:studentId", protectedRoute, getStudentExams);
router.get("/class/:classId", protectedRoute, getClassExams);
router.patch("/update/:examId", protectedRoute, updateExam);
router.delete("/delete/:examId", protectedRoute, deleteExam);

export default router;
