import mongoose from "mongoose";

// models/examModel.js
const examSchema = new mongoose.Schema({
  student: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Student", 
    required: [true, "Student reference is required"] 
  },
  marks: { 
    type: Number, 
    required: [true, "Marks are required"],
    min: [0, "Marks cannot be negative"]
  },
  total: { 
    type: Number, 
    required: [true, "Total marks are required"],
    min: [1, "Total marks must be at least 1"]
  },
  class: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Class', 
    required: [true, "Class reference is required"] 
  },
  examType: { 
    type: String, 
    enum: {
      values: ["mid-term", "final"],
      message: "Exam type must be either 'mid-term' or 'final'"
    },  
    required: [true, "Exam type is required"]
  },
  subjectId : {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Subject", 
    required: [true, "Subject reference is required"]
  },
  teacher: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Teachers" 
  },
  date: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true });


const Exam = mongoose.model("Exam", examSchema);

export default Exam;