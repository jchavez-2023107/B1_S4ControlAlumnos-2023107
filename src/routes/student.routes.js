// Rutas de estudiantes: permite asignar cursos, consultar cursos asignados, actualizar y eliminar perfil.
// Las rutas de consulta de todos los estudiantes o por ID son exclusivas para admin.

import { Router } from "express";
import { 
  assignCourse, 
  getMyCourses, 
  updateProfile, 
  deleteProfile,
  getAllStudents,
  getStudentById
} from "../controllers/student.controller.js";
import { validateJWT } from "../../middlewares/validate.jwt.js";
import { authorizeRoles } from "../../middlewares/authorizeRoles.js";

const api = Router();

// Rutas propias del alumno (operaciones de asignación, consulta personal, actualización y eliminación)
api.use("/assignCourse", validateJWT);
api.post("/assignCourse", assignCourse);

api.use("/myCourses", validateJWT);
api.get("/myCourses", getMyCourses);

api.use("/updateProfile", validateJWT);
api.put("/updateProfile", updateProfile);

api.use("/deleteProfile", validateJWT);
api.delete("/deleteProfile", deleteProfile);

// Rutas de consulta (solo accesibles para ADMIN)
api.get("/", validateJWT, authorizeRoles("ADMIN_ROLE"), getAllStudents);
api.get("/:id", validateJWT, authorizeRoles("ADMIN_ROLE"), getStudentById);

export default api;