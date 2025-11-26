const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET; 

console.log('DEPURACIÓN: JWT_SECRET cargado en middleware:', !!jwtSecret); 
if (!jwtSecret) {
    console.error('ERROR: JWT_SECRET no está definido. Revisa tu archivo .env');
}

// Middleware de autenticación
module.exports = function (req, res, next) {
    // 1. Obtener el token del header
    // El frontend (Angular) envía el token en el header 'x-auth-token'
    const token = req.header('x-auth-token'); 

    // AÑADIDO: Log de depuración para ver si el token está llegando
    console.log('DEPURACIÓN: Token recibido:', !!token); 

    // 2. Verificar si no existe el token
    if (!token) {
        // 401 significa No Autorizado (el usuario no ha proporcionado credenciales)
        return res.status(401).json({ message: 'Acceso denegado. No se proporcionó token.' });
    }

    try {
        // 3. Verificar el token usando la clave secreta
        // Si el token no tiene la firma correcta, jwt.verify lanzará un error.
        const decoded = jwt.verify(token, jwtSecret);

        // 4. Si el token es válido, inyectar el objeto de usuario (payload)
        // en el objeto 'req' para que las rutas puedan acceder al ID del usuario
        req.user = decoded; 
        
        // 5. Continuar con la siguiente función de middleware o la función de ruta
        next(); 

    } catch (error) {
        // 401 significa No Autorizado (el token es inválido, ha expirado, o la clave es incorrecta)
        res.status(401).json({ message: 'Token inválido o expirado.' });
    }
};