// Controlador de profesores: permite actualizar y eliminar su perfil,
// y proporciona endpoints de consulta para que un admin vea todos los profesores o uno en particular.

import User from "../models/user.model.js";

// Actualizar el perfil del profesor (retorna el usuario sin password)
export const updateProfile = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { name, surname, phone } = req.body;
    
    const teacher = await User.findById(teacherId);
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    if (teacher.role !== "TEACHER_ROLE") {
      return res.status(403).json({ message: "Only teachers can update their profile" });
    }
    
    const updatedTeacher = await User.findByIdAndUpdate(
      teacherId,
      { name, surname, phone },
      { new: true }
    ).select("-password");
    res.status(200).json({ message: "Profile updated", teacher: updatedTeacher });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating profile", error: error.message });
  }
};

// Eliminar el perfil del profesor
export const deleteProfile = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const teacher = await User.findById(teacherId);
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    if (teacher.role !== "TEACHER_ROLE") {
      return res.status(403).json({ message: "Only teachers can delete their profile" });
    }
    await User.findByIdAndDelete(teacherId);
    res.status(200).json({ message: "Profile deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting profile", error: error.message });
  }
};

// Consultar todos los profesores (solo accesible para admin)
export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await User.find({ role: "TEACHER_ROLE" }).select("-password");
    res.status(200).json({ teachers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving teachers", error: error.message });
  }
};

// Consultar un profesor por id (solo accesible para admin)
export const getTeacherById = async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await User.findOne({ _id: id, role: "TEACHER_ROLE" }).select("-password");
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    res.status(200).json({ teacher });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving teacher", error: error.message });
  }
};