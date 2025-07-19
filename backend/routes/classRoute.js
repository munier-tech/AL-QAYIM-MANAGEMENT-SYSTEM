import express from "express";
import {
  createClass,
  getAllClasses,
  getClassById,
  updateClass,
  deleteClass,
  assignStudentToClass
} from "../controllers/classController.js";

const router = express.Router();

router.post("/create", createClass);
router.get("/getAll", getAllClasses);
router.get("/getId/:classId", getClassById);
router.put("/update/:classId", updateClass);
router.delete("/delete/:classId", deleteClass);
router.post("/:studentId/:classId", assignStudentToClass);

export default router;
