// controllers/subjectController.js
import Subject from "../models/subjectModel.js";

// Create new subject
export const createSubject = async (req, res) => {
  try {
    const { name, code, teacher } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Subject name is required" });
    }

    const existing = await Subject.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: "Subject already exists" });
    }

    const subject = await Subject.create({ name, code, teacher });
    res.status(201).json({ message: "Subject created successfully", subject });
  } catch (error) {
    console.error("Error creating subject:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get all subjects
export const getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find().populate("teacher", "fullname");
    res.status(200).json({ message: "Subjects fetched", subjects });
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get subject by ID
export const getSubjectById = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const subject = await Subject.findById(subjectId).populate("teacher", "fullname");

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    res.status(200).json({ message: "Subject fetched", subject });
  } catch (error) {
    console.error("Error fetching subject:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update subject
export const updateSubject = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const { name, code, teacher } = req.body;

    const subject = await Subject.findByIdAndUpdate(
      subjectId,
      { ...(name && { name }), ...(code && { code }), ...(teacher && { teacher }) },
      { new: true }
    ).populate("teacher", "fullname");

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    res.status(200).json({ message: "Subject updated", subject });
  } catch (error) {
    console.error("Error updating subject:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete subject
export const deleteSubject = async (req, res) => {
  try {
    const { subjectId } = req.params;

    const deleted = await Subject.findByIdAndDelete(subjectId);

    if (!deleted) {
      return res.status(404).json({ message: "Subject not found" });
    }

    res.status(200).json({ message: "Subject deleted" });
  } catch (error) {
    console.error("Error deleting subject:", error);
    res.status(500).json({ message: error.message });
  }
};
