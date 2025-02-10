// Controlador de estudiantes: permite asignar cursos, ver cursos asignados, actualizar y eliminar el perfil,
// y provee endpoints para que un admin consulte todos los estudiantes o uno en particular.

import User from "../models/user.model.js";
import Course from "../models/course.model.js";

// Asignar un curso al alumno (máximo 3, sin duplicados)
export const assignCourse = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { courseId } = req.body;
    
    const student = await User.findById(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });
    if (student.role !== "STUDENT_ROLE") {
      return res.status(403).json({ message: "Only students can assign courses" });
    }
    
    if (student.courses.length >= 3) {
      return res.status(400).json({ message: "Maximum of 3 courses reached" });
    }
    if (student.courses.includes(courseId)) {
      return res.status(400).json({ message: "Course already assigned" });
    }
    
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });
    
    // Actualizar ambas relaciones: alumno y curso
    student.courses.push(courseId);
    await student.save();
    
    course.students.push(studentId);
    await course.save();
    
    res.status(200).json({ message: "Course assigned successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error assigning course", error: error.message });
  }
};

// Visualizar los cursos asignados al alumno
export const getMyCourses = async (req, res) => {
  try {
    const studentId = req.user.id;
    const student = await User.findById(studentId).populate("courses");
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.status(200).json({ courses: student.courses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving courses", error: error.message });
  }
};

// Actualizar el perfil del alumno (retorna el usuario sin password)
export const updateProfile = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { name, surname, phone } = req.body;
    const updatedStudent = await User.findByIdAndUpdate(
      studentId,
      { name, surname, phone },
      { new: true }
    ).select("-password");
    res.status(200).json({ message: "Profile updated", student: updatedStudent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating profile", error: error.message });
  }
};

// Eliminar el perfil del alumno y removerlo de los cursos asignados
export const deleteProfile = async (req, res) => {
  try {
    const studentId = req.user.id;
    const student = await User.findById(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });
    
    await Promise.all(student.courses.map(async (courseId) => {
      await Course.findByIdAndUpdate(courseId, { $pull: { students: studentId } });
    }));
    
    await User.findByIdAndDelete(studentId);
    res.status(200).json({ message: "Profile deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting profile", error: error.message });
  }
};

// Consultar todos los estudiantes (solo accesible para admin)
export const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "STUDENT_ROLE" }).select("-password");
    res.status(200).json({ students });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving students", error: error.message });
  }
};

// Consultar un estudiante por id (solo accesible para admin)
export const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await User.findOne({ _id: id, role: "STUDENT_ROLE" })
      .select("-password")
      .populate("courses");
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.status(200).json({ student });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving student", error: error.message });
  }
};