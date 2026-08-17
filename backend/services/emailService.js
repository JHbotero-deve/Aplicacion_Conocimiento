const nodemailer = require("nodemailer");

/**
 * Servicio centralizado para envío de alertas por correo
 */
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_PASS
    }
});

exports.enviarAlertaSeguridad = async (detalles) => {
    try {
        if (!process.env.ADMIN_EMAIL) {
            console.log("ℹ Correo de administración no configurado. Alerta omitida.");
            return;
        }

        await transporter.sendMail({
            from: `"Seguridad Ganadería Pro" <${process.env.ADMIN_EMAIL}>`,
            to: process.env.ADMIN_EMAIL,
            subject: "ALERTA DE SEGURIDAD - Ganadería Pro",
            html: `
                <div style="font-family: sans-serif; border: 2px solid red; padding: 20px; border-radius: 10px;">
                    <h2 style="color: red;">Detección de Actividad Sospechosa</h2>
                    <p>Se ha detectado una anomalía en el sistema que requiere su revisión inmediata:</p>
                    <ul style="background: #f9f9f9; padding: 15px; border-radius: 5px;">
                        <li><strong>Evento:</strong> ${detalles.evento}</li>
                        <li><strong>Fecha:</strong> ${new Date().toLocaleString()}</li>
                        <li><strong>Descripción:</strong> ${detalles.descripcion}</li>
                    </ul>
                    <p>Por favor, ingrese al panel administrativo para más detalles.</p>
                </div>
            `
        });
        console.log(" Alerta de seguridad enviada por correo.");
    } catch (error) {
        console.error("Error al enviar correo de alerta:", error.message);
    }
};
