/**
 * Sistema de Navegación Inteligente - Ganadería Pro
 * Maneja redirecciones por rol, protección de rutas y cierres de sesión.
 */

const navigation = {
    // 1. Proteger página: Si no hay token, fuera.
    checkAuth() {
        const token = localStorage.getItem("token");
        if (!token) {
            window.location.href = "login.html";
            return false;
        }
        return true;
    },

    // 2. Volver al Dashboard correcto según el rol guardado
    goBack() {
        const rol = localStorage.getItem("rol");
        switch (rol) {
            case 'admin':
                window.location.href = "admin_dashboard.html";
                break;
            case 'mayordomo':
                window.location.href = "mayordomo_dashboard.html";
                break;
            case 'veterinario':
                window.location.href = "veterinario_dashboard.html";
                break;
            default:
                window.location.href = "ganadero_dashboard.html";
        }
    },

    // 3. Cerrar sesión de forma segura
    logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("rol");
        window.location.href = "login.html";
    }
};

// Auto-ejecutar protección al cargar el script si la página no es login ni registro
if (!window.location.pathname.includes('login.html') && !window.location.pathname.includes('registro.html') && !window.location.pathname.includes('index.html')) {
    navigation.checkAuth();
}
