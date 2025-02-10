// Modelo de las personas, posible estudiante, profesor o admin.
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false }, //Oculto por defecto
    phone: { type: String },
    role: {
      type: String,
      enum: ["STUDENT_ROLE", "TEACHER_ROLE", "ADMIN_ROLE"],
      required: true,
    },
    // Este campo es relevante para los alumnos.
    // Para profesores se puede dejar vacío y se consultarán los cursos por la referencia en el modelo Course.
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
