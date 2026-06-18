const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

// Definimos rutas absolutas basadas en la ubicación de este script
const LOG_PATH = path.join(__dirname, "..", "backend", "logs", "access.log");
const ALERTS_PATH = path.join(__dirname, "..", "backend", "logs", "alertas.log");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.ADMIN_EMAIL, pass: process.env.ADMIN_PASS }
});

async function autoRevision() {
  try {
    // Usamos path.join para asegurar que la ruta sea correcta desde la raíz del proyecto
    const logFile = path.join(__dirname, "../backend/logs/access.log");
    const alertFile = path.join(__dirname, "../backend/logs/alertas.log");

    if (!fs.existsSync(logFile)) return;

    const accessLog = await fs.promises.readFile(logFile, "utf8");
    const intentosFallidos = accessLog.split("\n").filter(linea =>
      linea.includes("Token inválido") || linea.includes("Intento sin token")
    );
    if (intentosFallidos.length >= 5) {
      await fs.promises.appendFile(alertFile, `ALERTA: múltiples intentos fallidos el ${new Date().toISOString()}\n`);
      await enviarCorreo();
      // Limpiar el log después de la alerta para evitar correos duplicados
      await fs.promises.writeFile(logFile, "");
    }
  } catch (error) {
    console.error("Error en la revisión automática:", error);
  }
}

async function enviarCorreo() {
  try {
    await transporter.sendMail({
      from: process.env.ADMIN_EMAIL,
      to: process.env.ADMIN_EMAIL,
      subject: "Alerta de seguridad",
      text: "Se detectaron múltiples intentos fallidos en el sistema."
    });
  } catch (error) {
    console.error("Error enviando correo de alerta:", error);
  }
}

setInterval(autoRevision,5*60*1000);
