import Student from "../models/studentsModel.js";

// 1. Create Student
export const createStudent = async (req, res) => {
  try {
    const { fullname, age, gender, classId, motherNumber, fatherNumber } = req.body;

    if (!fullname || !motherNumber || !fatherNumber) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const student = new Student({
      fullname,
      age,
      gender,
      class: classId || null, 
      motherNumber,
      fatherNumber
    });

    await student.save();
    res.status(201).json({ message: "Student created successfully", student });
  } catch (error) {
    console.error("Error in createStudent:", error);
    res.status(500).json({ message: error.message });
  }
};

// 2. Get All Students
export const getAllStudents = async (req, res) => {
  try {
    const student = await Student.find().populate("class").sort({ createdAt: -1 });
    res.status(200).json({ students : student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Get Student By ID
export const getStudentById = async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findById(studentId).populate("class");

    if (!student) return res.status(404).json({ message: "Student not found" });

    res.status(200).json({ students : student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. Update Student
export const updateStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { fullname, age, gender, classId, motherNumber, fatherNumber } = req.body;

    const updated = await Student.findByIdAndUpdate(
      studentId,
      {
        fullname, age, gender, class: classId, motherNumber, fatherNumber
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Student not found" });

    res.status(200).json({ message: "Student updated", student: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 5. Delete Student
export const deleteStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const deleted = await Student.findByIdAndDelete(studentId);

    if (!deleted) return res.status(404).json({ message: "Student not found" });

    res.status(200).json({ message: "Student deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 6. Assign Student to a Class
export const assignStudentToClass = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { classId } = req.body;

    const student = await Student.findByIdAndUpdate(
      studentId,
      { class: classId },
      { new: true }
    );

    res.status(200).json({ message: "Class assigned", student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 8. Track or Update Fee Payment
export const trackFeePayment = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { total, paid } = req.body;

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Update fee values
    if (total !== undefined) student.fee.total = total;
    if (paid !== undefined) student.fee.paid += paid;

    await student.save();

    res.status(200).json({ message: "Fee payment updated", fee: student.fee });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFeeStatus = async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const { total, paid } = student.fee;
    const balance = total - paid;

    res.status(200).json({
      feeStatus: {
        total,
        paid,
        balance,
        status: balance === 0 ? "Paid" : balance < 0 ? "Overpaid" : "Pending"
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateFeeInfo = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { total, paid } = req.body;

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    // Directly update (replaces existing values)
    if (total !== undefined) student.fee.total = total;
    if (paid !== undefined) student.fee.paid = paid;

    await student.save();

    res.status(200).json({ message: "Fee information updated", fee: student.fee });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const deleteFeeInfo = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    student.fee = { total: 0, paid: 0 };

    await student.save();

    res.status(200).json({ message: "Fee information reset successfully", fee: student.fee });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
