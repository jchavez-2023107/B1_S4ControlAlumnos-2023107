// Controlador de cursos: permite a profesores crear, actualizar, eliminar y consultar cursos.
// Al eliminar un curso se desasignan automáticamente a los alumnos inscritos.

import Course from "../models/course.model.js";
import User from "../models/user.model.js";

// Crear un curso (solo para profesores)
export const createCourse = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.role !== "TEACHER_ROLE") {
      return res
        .status(403)
        .json({ message: "Only teachers can create courses" });
    }
    const { title, description } = req.body;
    const newCourse = new Course({
      title,
      description,
      teacher: teacherId,
    });
    await newCourse.save();
    res
      .status(201)
      .json({ message: "Course created successfully", course: newCourse });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error creating course", error: error.message });
  }
};

// Actualizar un curso (solo el profesor propietario)
export const updateCourse = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });
    if (course.teacher.toString() !== teacherId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this course" });
    }

    const { title, description } = req.body;
    course.title = title || course.title;
    course.description = description || course.description;
    await course.save();
    res.status(200).json({ message: "Course updated successfully", course });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error updating course", error: error.message });
  }
};

// Eliminar un curso (solo el profesor propietario) y desasignar a los alumnos
export const deleteCourse = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });
    if (course.teacher.toString() !== teacherId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this course" });
    }

    await Promise.all(
      course.students.map(async (studentId) => {
        await User.findByIdAndUpdate(studentId, {
          $pull: { courses: courseId },
        });
      })
    );
    await course.deleteOne();
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error deleting course", error: error.message });
  }
};

// Consultar cursos creados por el profesor
export const getCoursesByTeacher = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.role !== "TEACHER_ROLE") {
      return res
        .status(403)
        .json({ message: "Only teachers can access their courses" });
    }
    const courses = await Course.find({ teacher: teacherId });
    res.status(200).json({ courses });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error fetching courses", error: error.message });
  }
};

// Consultar detalles de un curso por id (con referencias)
export const getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId)
      .populate("teacher")
      .populate("students");
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.status(200).json({ course });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error fetching course details", error: error.message });
  }
};

// Consultar todos los cursos (accesible para profesores y admin)
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("teacher")
      .populate("students");
    res.status(200).json({ courses });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error fetching all courses", error: error.message });
  }
};

// Consultar un curso por id (alias similar a getCourseDetails; accesible para profesores y admin)
export const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id)
      .populate("teacher")
      .populate("students");
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.status(200).json({ course });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error fetching course", error: error.message });
  }
};
