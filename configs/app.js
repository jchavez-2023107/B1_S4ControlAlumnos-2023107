//Levantar servidor express (HTTP)

//Modular | + efectiva + legible | trabaja en funciones

"use strict";

//ECModules | ESModules
import express from "express"; //Servidor HTTP
import morgan from "morgan"; //Logs
import helmet from "helmet"; //Seguridad para HTTP
import cors from "cors"; //Acceso al API

//Importamos las rutas de las entidades a trabajar.
import authRoutes from "../src/routes/auth.routes.js";
import studentRoutes from "../src/routes/student.routes.js";
import teacherRoutes from "../src/routes/teacher.routes.js";
import courseRoutes from "../src/routes/course.routes.js";

//El dotenv
import dotenv from "dotenv";
import { limiter } from "../middlewares/rate.limit.js";
dotenv.config(); // <-- Asegura que .env se cargue correctamente

//Configuraciones de express metidas en una función
const configs = (app) => {
  app.use(express.json()); //Aceptar y enviar datos en JSON
  app.use(express.urlencoded({ extended: false })); //No encriptar la URL
  app.use(cors()); //Antes que los demás que vienen bajo este. (Políticas de seguridad)
  app.use(helmet()); //Seguridad de express (HTTP)
  app.use(morgan("dev")); //Gestionador de Logs (dev: )
  app.use(limiter);
};

//Cuando tengamos rutas.
// ✅ Carga de rutas
const routes = (app) => {
  app.use("/api/auth", authRoutes); // Registro y login
  app.use("/api/students", studentRoutes); // Funciones específicas de alumnos
  app.use("/api/teachers", teacherRoutes); // Funciones específicas de profesores
  app.use("/api/courses", courseRoutes); // Gestión de cursos (puede estar integrado en teachers)
};

//Ejecutamos el servidor
export const initServer = () => {
  //Crear instancia de express
  const app = express(); //Instancia de express
  try {
    //servidor : app.
    configs(app);
    routes(app);
    //puerto en el que corre: 2636.
    app.listen(process.env.PORT);
    //Impresión sobre el puerto en el que corre.
    console.log(`Server running on port ${process.env.PORT}`);
  } catch (err) {
    //Impresión del fallo de inicialización del servidor, impresión del error.
    console.error("Server init failed", err);
    process.exit(1); // Cierra el proceso si hay error
  }
};
