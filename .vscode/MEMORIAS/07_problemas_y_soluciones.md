# 07 — Problemas y Soluciones

---

## [2026-05-31] Input name incorrecto en login y registro

**Problema:** `<input name="contrasena_hash">` en `login.html` y `registro.html`  
**Causa:** El nombre del input no coincide con el campo que se envía al backend  
**Solución:** Cambiar `name="contrasena_hash"` a `name="contrasena"` en ambos formularios  
**Estado:** 🔴 Pendiente  

---

## [2026-05-31] edad y peso se envían como string

**Problema:** `ganadoForm.edad.value` devuelve `"3"` (string), no `3` (number)  
**Causa:** `.value` de inputs HTML siempre es string  
**Solución:** Envolver con `Number()` al construir el objeto data  
**Estado:** 🔴 Pendiente  

---

## [2026-05-31] services/api.js y alerts/alerts.js sin uso

**Problema:** Archivos creados pero no importados en ningún HTML  
**Causa:** Lógica duplicada inline en cada formulario  
**Solución:** Centralizar fetch en `api.js` e importarlo en cada HTML, o eliminar si no se va a usar en el HTML actual  
**Estado:** 🔴 Pendiente  

---

## [2026-05-31] prisma.config.js usa ESM en proyecto CommonJS

**Problema:** `import { defineConfig }` en proyecto sin `"type": "module"`  
**Causa:** Archivo generado automáticamente por Prisma con sintaxis ESM  
**Solución:** No ejecutar ese archivo directamente. Al migrar a Prisma completo, convertir a `require()` o agregar `"type": "module"` al `package.json` con cuidado  
**Estado:** 🟡 No urgente  

---

## [2026-05-31] CORS abierto

**Problema:** `app.use(cors())` permite cualquier origen  
**Causa:** Configuración de desarrollo  
**Solución:** En producción: `app.use(cors({ origin: "https://dominio.com" }))`  
**Estado:** 🟡 Posponer a etapa de despliegue  

---

## [2026-05-31] JWT_SECRET débil

**Problema:** `JWT_SECRET="clave_super_segura"` en `.env`  
**Causa:** Valor de ejemplo para desarrollo  
**Solución:** Reemplazar por string aleatorio de 64+ caracteres antes de producción  
**Estado:** 🟡 Posponer a etapa de despliegue  
