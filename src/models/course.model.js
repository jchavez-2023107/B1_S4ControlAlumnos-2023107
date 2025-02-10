// modelo de los cursos para el sistema.
import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    // Referencia al profesor que creó el curso
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    // Opcional: Almacena los alumnos que se inscribieron al curso.
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);