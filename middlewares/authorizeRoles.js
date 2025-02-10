/**
 * Middleware para autorizar el acceso a rutas basado en el rol del usuario.
 * 
 * Esta función recibe una lista de roles permitidos (por ejemplo, "ADMIN_ROLE", "TEACHER_ROLE")
 * y retorna un middleware que verifica si el rol del usuario (obtenido previamente, por ejemplo, a través del middleware validateJWT)
 * se encuentra entre los roles permitidos.
 * 
 * Si el rol del usuario no está incluido en la lista, se envía una respuesta con código 403 (Forbidden) y un mensaje de error.
 * Si el rol es válido, se llama a next() para continuar con la siguiente función o controlador.
 * 
 * Ejemplo de uso:
 * 
 *   app.get('/ruta-protegida', validateJWT, authorizeRoles('ADMIN_ROLE'), (req, res) => {
 *     // Código de la ruta protegida
 *   });
 *
 * @param  {...string} roles - Los roles permitidos para acceder a la ruta.
 * @returns {Function} Middleware que verifica el rol del usuario.
 */
export const authorizeRoles = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
    }
    next();
  };