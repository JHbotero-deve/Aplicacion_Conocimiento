/**
 * Sistema de Notificaciones Visuales Estilo Tailwind
 * Reemplaza los alerts clásicos por banners elegantes.
 */

function mostrarAlerta(mensaje, tipo = 'success') {
    const container = document.getElementById('alertContainer') || crearContenedorAlertas();

    const alert = document.createElement('div');
    const bgClass = tipo === 'success' ? 'bg-emerald-600' : 'bg-red-600';
    const icon = tipo === 'success' ? 'fa-check-circle' : 'fa-triangle-exclamation';

    alert.className = `${bgClass} text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center justify-between transform translate-y-10 opacity-0 transition-all duration-300 mb-4 min-w-[300px]`;
    alert.innerHTML = `
        <div class="flex items-center gap-3 font-bold">
            <i class="fa-solid ${icon} text-xl"></i>
            <span>${mensaje}</span>
        </div>
        <button onclick="this.parentElement.remove()" class="ml-4 hover:scale-110 transition opacity-70">
            <i class="fa-solid fa-xmark"></i>
        </button>
    `;

    container.appendChild(alert);

    // Animación de entrada
    setTimeout(() => {
        alert.classList.remove('translate-y-10', 'opacity-0');
    }, 10);

    // Auto-eliminar después de 5 segundos
    setTimeout(() => {
        alert.classList.add('opacity-0', 'scale-95');
        setTimeout(() => alert.remove(), 300);
    }, 5000);
}

function crearContenedorAlertas() {
    const div = document.createElement('div');
    div.id = 'alertContainer';
    div.className = 'fixed bottom-8 right-8 z-[100] flex flex-col items-end pointer-events-none children:pointer-events-auto';
    document.body.appendChild(div);
    return div;
}

// Inyectar Font Awesome si no existe
if (!document.querySelector('link[href*="font-awesome"]')) {
    const link = document.createElement('link');
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
}
