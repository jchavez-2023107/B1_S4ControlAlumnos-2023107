// Rutas de cursos: permite a profesores crear, actualizar, eliminar cursos y consultar cursos.
// Las consultas (get all y get by ID) requieren token con rol TEACHER_ROLE o ADMIN_ROLE.

import { Router } from "express";
import { 
  createCourse, 
  updateCourse, 
  deleteCourse, 
  getCoursesByTeacher,
  getAllCourses,
  getCourseById
} from "../controllers/course.controller.js";
import { validateJWT } from "../../middlewares/validate.jwt.js";
import { authorizeRoles } from "../../middlewares/authorizeRoles.js";

const api = Router();

// Todas las rutas de cursos requieren autenticación
api.use(validateJWT);

// Rutas exclusivas para profesores (crear, actualizar, eliminar, y mis cursos)
api.post("/", createCourse);
api.put("/:courseId", updateCourse);
api.delete("/:courseId", deleteCourse);
api.get("/my-courses", getCoursesByTeacher);

// Rutas de consulta generales: obtener todos y por id (accesibles para profesor y admin)
api.get("/", authorizeRoles("TEACHER_ROLE", "ADMIN_ROLE"), getAllCourses);
api.get("/:id", authorizeRoles("TEACHER_ROLE", "ADMIN_ROLE"), getCourseById);

export default api;
