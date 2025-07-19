import Attendance from "../models/attendanceModel";
import Class from "../models/classModel";
import Student from "../models/studentsModel";


export const createAttendance = async (req, res) => {
  try {
    const { classId, date, students , status} = req.body;

    if (!classId || !date || !students || !Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ message: "All fields (classId, date, students[]) are required" });
    }

    // Optional: Check if class exists
    const foundClass = await Class.findById(classId);
    if (!foundClass) {
      return res.status(404).json({ message: "Class not found" });
    }
    const foundStudent = await Student.findById(students[0].student);
    if (!foundStudent) {
      return res.status(404).json({ message: `Student with ID  not found` });
    }

    if (!status) {
      return res.status(400).json({ message: "Status is required for each student" });
    }
  

    const newAttendance = new Attendance({
      class: classId,
      date: new Date(date),
      students
    });

    await newAttendance.save();

    res.status(201).json({ message: "Attendance recorded successfully", attendance: newAttendance });
  } catch (error) {
    console.error("Error in createAttendance:", error);
    res.status(500).json({ message: error.message });
  }
};
