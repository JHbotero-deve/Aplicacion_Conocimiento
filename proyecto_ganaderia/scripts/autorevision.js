const fs = require("fs");
const nodemailer = require("nodemailer");

function autoRevision(){
  const accessLog = fs.readFileSync("./backend/logs/access.log","utf8");
  const intentosFallidos = accessLog.split("\n").filter(linea =>
    linea.includes("Token inválido") || linea.includes("Intento sin token")
  );
  if(intentosFallidos.length>=5){
    fs.appendFileSync("./backend/logs/alertas.log","ALERTA: múltiples intentos fallidos\n");
    enviarCorreo();
  }
}

function enviarCorreo(){
  const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{user:process.env.ADMIN_EMAIL,pass:process.env.ADMIN_PASS}
  });
  transporter.sendMail({
    from:process.env.ADMIN_EMAIL,
    to:process.env.ADMIN_EMAIL,
    subject:"Alerta de seguridad",
    text:"Se detectaron múltiples intentos fallidos en el sistema."
  });
}

setInterval(autoRevision,5*60*1000);
