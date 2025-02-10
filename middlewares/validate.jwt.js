//Validar los tokens
//Declarar variables y funciones antes de usarlas.
"use strict";

import jwt from "jsonwebtoken";

export const validateJWT = async (req, res, next) => {
  try {
    // Obtener la llave de acceso privada al token
    let secretKey = process.env.SECRET_KEY;

    // Obtener el token de los headers (cabeceras)
    let { authorization } = req.headers;

    // Verificar que el token esté presente y tenga el formato correcto
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    // Extraer el token eliminando "Bearer "
    let token = authorization.split(" ")[1];

    // Verificar el token
    let decoded = jwt.verify(token, secretKey);

    // Inyectar en la solicitud el usuario autenticado
    req.user = {
      id: decoded.uid,   // Usamos el `uid` del token
      username: decoded.username,
      role: decoded.role
    };

    // Continuar con la siguiente función
    next();
  } catch (err) {
    console.error("❌ JWT Error:", err);
    return res.status(401).json({ message: "Invalid credentials" });
  }
};


//200-204, 400-418 y 500-505 códigos
