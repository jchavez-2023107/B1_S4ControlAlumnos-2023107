// Rutas de autenticación: registra estudiantes, profesores, administradores y permite login.

import { Router } from "express";
import { login, registerStudent, registerTeacher, registerAdmin } from "../controllers/auth.controller.js";
import { registerValidator } from "../../middlewares/validators.js";

const api = Router();

// Registro para estudiantes, profesores y administradores
api.post("/register/student", registerValidator, registerStudent);
api.post("/register/teacher", registerValidator, registerTeacher);
api.post("/register/admin", registerValidator, registerAdmin);

// Ruta para login (usa el campo "userlogin" para username o email)
api.post("/login", login);

export default api;