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
        const base = window.location.pathname.includes('/forms/') ? '' : 'forms/';

        switch (rol) {
            case 'admin':
                window.location.href = base + "admin_dashboard.html";
                break;
            case 'mayordomo':
                window.location.href = base + "mayordomo_dashboard.html";
                break;
            case 'veterinario':
                window.location.href = base + "veterinario_dashboard.html";
                break;
            case 'usuario':
                window.location.href = base + "ganadero_dashboard.html";
                break;
            default:
                this.logout();
        }
    },

    // 3. Cerrar sesión de forma segura
    logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("rol");
        const isSubdir = window.location.pathname.includes('/forms/');
        window.location.href = (isSubdir ? '' : 'forms/') + "login.html";
    },

    // 5. Inyectar Footer Corporativo
    renderFooter(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
            <footer class="mt-20 py-16 border-t border-slate-200 bg-slate-50">
                <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div class="col-span-1 md:col-span-1">
                        <div class="flex items-center gap-2 mb-6">
                            <div class="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white">
                                <i class="fa-solid fa-cow text-sm"></i>
                            </div>
                            <span class="text-lg font-black tracking-tighter text-slate-900 uppercase">Ganadería<span class="text-emerald-600">Pro</span></span>
                        </div>
                        <p class="text-xs font-medium text-slate-500 leading-relaxed">
                            Líderes en tecnología pecuaria de precisión. Optimizando la productividad del campo colombiano con estándares globales.
                        </p>
                    </div>
                    <div>
                        <h4 class="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-6">Plataforma</h4>
                        <ul class="space-y-4 text-xs font-bold text-slate-500">
                            <li><a href="#" onclick="navigation.goBack()" class="hover:text-emerald-600 transition-colors">Panel de Control</a></li>
                            <li><a href="#" class="hover:text-emerald-600 transition-colors">Manual de Operario</a></li>
                            <li><a href="#" class="hover:text-emerald-600 transition-colors">Protocolos ICA</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 class="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-6">Legal</h4>
                        <ul class="space-y-4 text-xs font-bold text-slate-500">
                            <li><a href="#" class="hover:text-emerald-600 transition-colors">Términos de Uso</a></li>
                            <li><a href="#" class="hover:text-emerald-600 transition-colors">Privacidad Steel Edge</a></li>
                            <li><a href="#" class="hover:text-emerald-600 transition-colors">Certificación PWA</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 class="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-6">Soporte Corporativo</h4>
                        <p class="text-xs font-bold text-slate-900 mb-4">línea 24/7: +57 (601) 000-0000</p>
                        <div class="flex gap-4 text-slate-400">
                            <i class="fa-brands fa-whatsapp hover:text-emerald-500 transition-colors cursor-pointer"></i>
                            <i class="fa-solid fa-envelope-open-text hover:text-emerald-500 transition-colors cursor-pointer"></i>
                            <i class="fa-solid fa-building-shield hover:text-emerald-500 transition-colors cursor-pointer"></i>
                        </div>
                    </div>
                </div>
                <div class="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-slate-200 flex flex-col md:row justify-between items-center gap-4">
                    <p class="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">© 2026 Ganadería Pro · Versión 4.2.0-SteelEdge</p>
                    <div class="flex items-center gap-6 opacity-30 grayscale contrast-125">
                        <i class="fa-solid fa-shield-check text-xl"></i>
                        <i class="fa-solid fa-cloud-arrow-up text-xl"></i>
                        <i class="fa-solid fa-microchip text-xl"></i>
                    </div>
                </div>
            </footer>
        `;
    },

    // 4. Temporizador de Inactividad (Seguridad Irrompible)
    initInactivityTimer() {
        let timer;
        const resetTimer = () => {
            clearTimeout(timer);
            // 1 hora = 3,600,000 milisegundos
            timer = setTimeout(() => {
                console.warn("Sesión cerrada por inactividad (1 hora)");
                this.logout();
            }, 3600000);
        };

        // Escuchar interacciones del usuario para resetear el tiempo
        window.onload = resetTimer;
        document.onmousemove = resetTimer;
        document.onkeypress = resetTimer;
        document.ontouchstart = resetTimer;
        document.onclick = resetTimer;
    }
};

// Auto-ejecutar protección e inactividad
if (!window.location.pathname.includes('login.html') &&
    !window.location.pathname.includes('registro.html') &&
    !window.location.pathname.includes('index.html')) {
    if (navigation.checkAuth()) {
        navigation.initInactivityTimer();
    }
}
