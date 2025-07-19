import Class from "../models/classModel.js";
import Student from "../models/studentsModel.js";

// Create new class
export const createClass = async (req, res) => {
  try {
    const { name, level } = req.body;

    if (!name || !level) {
      return res.status(400).json({ message: "Name and level are required" });
    }

    const existing = await Class.findOne({ name });
    if (existing) {
      return res.status(409).json({ message: "Class already exists" });
    }

    const newClass = new Class({ name, level });
    await newClass.save();

    res.status(201).json({ message: "Class created successfully", classData: newClass });
  } catch (error) {
    console.error("createClass error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get all classes
export const getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find().populate("students");
    res.status(200).json({ classes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get class by ID
export const getClassById = async (req, res) => {
  try {
    const { classId } = req.params;
    const classData = await Class.findById(classId).populate("students");

    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }

    res.status(200).json({ classData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update class
export const updateClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const { name, level } = req.body;

    const updated = await Class.findByIdAndUpdate(
      classId,
      { name, level },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Class not found" });
    }

    res.status(200).json({ message: "Class updated", classData: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete class
export const deleteClass = async (req, res) => {
  try {
    const { classId } = req.params;

    const deleted = await Class.findByIdAndDelete(classId);
    if (!deleted) {
      return res.status(404).json({ message: "Class not found" });
    }

    res.status(200).json({ message: "Class deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Assign student to class
// controllers/classController.js
export const assignStudentToClass = async (req, res) => {
  const { classId, studentId } = req.params;

  try {
    const foundClass = await Class.findById(classId);
    const student = await Student.findById(studentId);

    if (!foundClass || !student) {
      return res.status(404).json({ message: "Class or student not found" });
    }

    if (foundClass.students.some(id => id.toString() === studentId)) {
  return res.status(400).json({ message: "Student already assigned to this class" });
}


    // Assign
    foundClass.students.push(studentId);
    await foundClass.save();

    student.class = classId;
    await student.save();

    res.status(200).json({ message: "Student assigned to class successfully" });
  } catch (error) {
    console.error("Error assigning student:", error);
    res.status(500).json({ message: error.message });
  }
};

