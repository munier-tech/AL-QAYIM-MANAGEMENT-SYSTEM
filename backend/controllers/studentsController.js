import Student from "../models/studentModel.js";

// Create a new student
export const createStudent = async (req, res) => {
  try {
    const { name, age, gender, class: className, motherNumber, fatherNumber } = req.body;

    if (!name || !className || !motherNumber || !fatherNumber) {
      return res.status(400).json({ message: "Required fields are missing." });
    }

    const student = new Student({
      name,
      age,
      gender,
      class: className,
      motherNumber,
      fatherNumber,
    });

    await student.save();
    res.status(201).json({ message: "Student created successfully", student });
  } catch (error) {
    console.error("Error creating student:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get all students
export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.status(200).json({ students });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single student by ID
export const getStudentById = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await Student.findById(studentId)
      .populate("healthRecords")
      .populate("examRecords")
      .populate("disciplineReports");

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({ student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update student info
export const updateStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { name, age, gender, class: className, motherNumber, fatherNumber } = req.body;

    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      { name, age, gender, class: className, motherNumber, fatherNumber },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({ message: "Student updated", student: updatedStudent });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete student
export const deleteStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    const deletedStudent = await Student.findByIdAndDelete(studentId);

    if (!deletedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
