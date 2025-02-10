// Rutas de profesores: permite actualizar y eliminar su perfil.
// Las rutas de consulta de todos los profesores o por ID son exclusivas para admin.

import { Router } from "express";
import { 
  updateProfile, 
  deleteProfile, 
  getAllTeachers,
  getTeacherById
} from "../controllers/teacher.controller.js";
import { validateJWT } from "../../middlewares/validate.jwt.js";
import { authorizeRoles } from "../../middlewares/authorizeRoles.js";

const api = Router();

// Rutas propias del profesor (actualización y eliminación de perfil)
api.use("/updateProfile", validateJWT);
api.put("/updateProfile", updateProfile);

api.use("/deleteProfile", validateJWT);
api.delete("/deleteProfile", deleteProfile);

// Rutas de consulta (solo accesibles para ADMIN)
api.get("/", validateJWT, authorizeRoles("ADMIN_ROLE"), getAllTeachers);
api.get("/:id", validateJWT, authorizeRoles("ADMIN_ROLE"), getTeacherById);

export default api;