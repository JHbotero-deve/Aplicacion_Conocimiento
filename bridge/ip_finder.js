const os = require('os');

function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
}

const ip = getLocalIP();
console.log(`\n🚀 SISTEMA LISTO PARA EL CAMPO`);
console.log(`================================`);
console.log(`Acceso desde esta PC: http://localhost:8000`);
console.log(`Acceso desde Celulares: http://${ip}:8000`);
console.log(`================================`);
console.log(`\nInstrucciones para el personal:`);
console.log(`1. Asegúrese de que el celular esté en el mismo WiFi.`);
console.log(`2. Abra el navegador e ingrese a http://${ip}:8000`);
console.log(`3. Toque en 'Añadir a pantalla de inicio' para usarlo como App.\n`);
