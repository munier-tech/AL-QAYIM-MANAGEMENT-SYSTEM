import Teachers from "../models/teachersModel.js";


export const createTeacher = async (req, res) => {
  try {

    const { name, number , email , profilePicture, subject , certificate } = req.body;

    if (!name , !number , !email  , !subject) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingTeacher = await Teachers.findOne({ email });
    if (existingTeacher) {
      return res.status(400).json({ message: "Teacher with this email already exists" });
    }


    let cloudinaryResponse = null;

    if (profilePicture) {
      const uploadResponse = await cloudinary.uploader.upload(profilePicture);
      cloudinaryResponse = uploadResponse.secure_url;
    }

    const teacher = new Teachers({
      name,
      number,
      email,
      profilePicture: cloudinaryResponse?.secure_url ? cloudinaryResponse?.secure_url : "no profile picture",
      certificate: certificate ? certificate : "no certificate",
      subject
    });


    await teacher.save();

    res.status(201).json({ message: "Teacher created successfully", teacher });
    
  } catch (error) {
    console.error("Error in createTeacher function: ", error);
    res.status(500).json({ message: error.message });
  }
}


export const getAllTeachers = async (req, res) => {
  try {

    const teacher = await Teachers.find({}).sort({ createdAt: -1 });
    

    res.status(200).json({ message: "Teachers fetched successfully", teachers: teacher });
  } catch (error) {
    console.error("Error in getAllTeachers function: ", error);
    res.status(500).json({ message: error.message });
  }
}

export const getTeacherById = async (req, res) => {
  try {

  const { teacherId } = req.params;

  const teacher = await Teachers.findById(teacherId);

  if (!teacher) {
    return res.status(404).json({ message: "Teacher not found" });
  }

  res.status(200).json({ message: "Teacher fetched successfully", teacher });
    
  } catch (error) {
    
  }
}

export const updateTeacher = async (req, res) => {
  try {

    const { teacherId } = req.params;
    const { name, number, email, profilePicture, subject } = req.body;

    
    let cloudinaryResponse = null;

    if (profilePicture) {
      const uploadResponse = await cloudinary.uploader.upload(profilePicture);
      cloudinaryResponse = uploadResponse.secure_url;
    }

    const teacher = await Teachers.findByIdAndUpdate(teacherId, {
      name,
      number,
      email,
      profilePicture: cloudinaryResponse?.secure_url ? cloudinaryResponse?.secure_url : "no profile picture",
      subject
    }, { new: true });

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.status(200).json({ message: "Teacher updated successfully", teacher });
  } catch (error) {
    console.error("Error in updateTeacher function: ", error);
    res.status(500).json({ message: error.message });
  }
}


export const deleteTeacher = async (req, res) => {
  try {
    const { teacherId } = req.params;

    const teacher = await Teachers.findByIdAndDelete(teacherId);

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Optionally, you can also delete the profile picture from Cloudinary if it exists

    if (teacher.profilePicture && teacher.profilePicture !== "no profile picture") {
      const publicId = teacher.profilePicture.split('/').pop().split('.')[0]; // Extract public ID from URL
      await cloudinary.uploader.destroy(publicId); // Delete from Cloudinary
    }
    res.status(200).json({ message: "Teacher deleted successfully" });
  } catch (error) {
    console.error("Error in deleteTeacher function: ", error);
    res.status(500).json({ message: error.message });
  }
}

