// Controlador de autenticación: maneja el registro (estudiante, profesor y admin) y el login.
// El login acepta el campo "userlogin" (que puede ser username o email) para autenticar.

import User from "../models/user.model.js";
import { encrypt, checkPassword } from "../../utils/encrypt.js";
import { generateJwt } from "../../utils/jwt.js";

// Registro para estudiantes
export const registerStudent = async (req, res) => {
  try {
    const { name, surname, username, email, password, phone } = req.body;
    const hashedPassword = await encrypt(password);
    const newUser = new User({
      name,
      surname,
      username,
      email,
      password: hashedPassword,
      phone,
      role: "STUDENT_ROLE",
    });
    await newUser.save();

    // Convertir a objeto y eliminar la contraseña de la respuesta
    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json({
      message: "Student registered successfully",
      user: userResponse,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error registering student",
      error: error.message,
    });
  }
};

// Registro para profesores
export const registerTeacher = async (req, res) => {
  try {
    const { name, surname, username, email, password, phone, role } = req.body;

    // Verificar que el campo role esté presente y sea exactamente "TEACHER_ROLE"
    if (!role || role !== "TEACHER_ROLE") {
      return res.status(400).json({
        message:
          "Invalid role for teacher registration. You must provide role 'TEACHER_ROLE'.",
      });
    }

    const hashedPassword = await encrypt(password);
    const newUser = new User({
      name,
      surname,
      username,
      email,
      password: hashedPassword,
      phone,
      role, // Aquí se utiliza el rol enviado, que se ha verificado
    });
    await newUser.save();

    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json({
      message: "Teacher registered successfully",
      user: userResponse,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error registering teacher",
      error: error.message,
    });
  }
};

// Registro para administradores
export const registerAdmin = async (req, res) => {
  try {
    const { name, surname, username, email, password, phone } = req.body;
    const hashedPassword = await encrypt(password);
    const newUser = new User({
      name,
      surname,
      username,
      email,
      password: hashedPassword,
      phone,
      role: "ADMIN_ROLE",
    });
    await newUser.save();

    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json({
      message: "Admin registered successfully",
      user: userResponse,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error registering admin",
      error: error.message,
    });
  }
};

// Login (acepta userlogin que puede ser username o email)
export const login = async (req, res) => {
  try {
    // El campo "userlogin" se usará para username o email
    const { userlogin, password } = req.body;
    const user = await User.findOne({
      $or: [{ username: userlogin }, { email: userlogin }],
    }).select("+password"); // Se incluye password para comparar

    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    const isValid = await checkPassword(user.password, password);
    if (!isValid)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = await generateJwt({
      uid: user._id,
      username: user.username,
      role: user.role,
    });
    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Login error",
      error: error.message,
    });
  }
};