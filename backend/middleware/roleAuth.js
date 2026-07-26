/**
 * Middleware para verificar roles de usuario
 * @param {Array} rolesPermitidos - Lista de roles que tienen acceso (ej. ['admin', 'veterinario'])
 */
module.exports = (rolesPermitidos) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: "No autenticado" });
        }

        if (rolesPermitidos.includes(req.user.rol)) {
            next();
        } else {
            res.status(403).json({ error: "Acceso denegado: No tienes los permisos necesarios" });
        }
    };
};
