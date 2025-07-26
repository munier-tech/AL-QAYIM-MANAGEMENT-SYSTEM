import Class from "../models/classModel.js";
import Exam from "../models/examModel.js";
import Student from "../models/studentsModel.js";





export const createExam = async (req, res) => {
  try {
   const { studentIdentifier, subjectId, marks, total, date, classIdentifier, examType } = req.body;

    if (!studentIdentifier || !classIdentifier || !subjectId || 
        marks === undefined || total === undefined || !examType) {
      return res.status(400).json({ 
        message: "All fields are required",
        missingFields: {
          studentIdentifier: !studentIdentifier,
          classIdentifier: !classIdentifier,
          subjectId: !subjectId,
          marks: marks === undefined,
          total: total === undefined,
          examType: !examType
        }
      });
    }

    if (!["mid-term", "final"].includes(examType)) {
      return res.status(400).json({ 
        message: "Invalid exam type. Must be either 'mid-term' or 'final'" 
      });
    }

    // ✅ Step 1: Find the student by ID or partial name
    const student = await Student.findOne({
      $or: [
        { _id: studentIdentifier },
        { fullname: { $regex: new RegExp(studentIdentifier, "i") } }
      ]
    }).populate("class");

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // ✅ Step 2: Find the class by ID or partial name
    const classDoc = await Class.findOne({
      $or: [
        { _id: classIdentifier },
        { name: { $regex: new RegExp(classIdentifier, "i") } }
      ]
    });

    if (!classDoc) {
      return res.status(404).json({ message: "Class not found" });
    }

    // ✅ Optional check: Does student actually belong to that class?
    if (student.class && student.class._id.toString() !== classDoc._id.toString()) {
      return res.status(400).json({ message: "Student does not belong to the specified class" });
    }

    // ✅ Step 3: Create the exam
    const exam = new Exam({
      student: student._id,
      subjectId,
      marks,
      examType,
      total,
      date: date ? new Date(date) : undefined,
      class: classDoc._id,
      teacher: req.user._id // assuming protectedRoute sets this
    });

    await exam.save();

    const populatedExam = await Exam.findById(exam._id)
    .populate("student", "fullname gender age")
    .populate("subjectId", "name teacher")

    res.status(201).json({ message: "Exam created successfully", exam : populatedExam });

  } catch (error) {
    console.error("Error creating exam:", error);
    res.status(500).json({ message: error.message });
  }
};




export const getStudentExams = async ( req , res  ) => {
  try {

    const { studentId } = req.params;

    const exams = await Exam.find({ student: studentId }).populate("student", "fullname").sort({ date: -1 });
    

    if (!exams || exams.length === 0) {
      return res.status(404).json({ message: "No exams found for this student" });
    }

    res.status(200).json({ message: "Exams retrieved successfully", exams });
  } catch (error) {
    console.error("Error fetching student exams:", error);
    res.status(500).json({ message: error.message });
  }
} 


export const getClassExams = async ( req , res  ) => {
  try {

    const { classId } = req.params;

    const exams = await Exam.find({ class: classId })
      .populate("student", "fullname")
      .sort({ date: -1 });

    if (!exams || exams.length === 0) {
      return res.status(404).json({ message: "No exams found for this class" });
    }

    res.status(200).json({ message: "Exams retrieved successfully", exams });
    
  } catch (error) {
    console.error("Error fetching class exams:", error);
    res.status(500).json({ message: error.message });
  }
}

export const updateExam = async (req, res) => {
  try {
    const { examId } = req.params;
    const { subject, marks, total, date, type } = req.body;

    if (type && !["mid-term", "final"].includes(type)) {
      return res.status(400).json({
        message: "Invalid exam type. Must be either 'mid-term' or 'final'"
      });
    }

    const updatedExam = await Exam.findByIdAndUpdate(
      examId,
      {
        ...(subject && { subject }),
        ...(marks !== undefined && { marks }),
        ...(total !== undefined && { total }),
        ...(date && { date }),
        ...(type && { type })
      },
      { new: true }
    ).populate("student", "fullname");

    if (!updatedExam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    res.status(200).json({ message: "Exam updated successfully", exam: updatedExam });
  } catch (error) {
    console.error("Error updating exam:", error);
    res.status(500).json({ message: error.message });
  }
};
 

export const deleteExam = async (req, res) => {
  try {
    const { examId } = req.params;

    const deletedExam = await Exam.findByIdAndDelete(examId);

    if (!deletedExam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    res.status(200).json({ message: "Exam deleted successfully" });
  } catch (error) {
    console.error("Error deleting exam:", error);
    res.status(500).json({ message: error.message });
  }
};
