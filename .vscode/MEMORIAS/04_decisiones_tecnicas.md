# 04 — Decisiones Técnicas

---

## [2026-05-27] Backend en CommonJS (require)
**Decisión:** Mantener todo el backend con `require()`, no `import`  
**Motivo:** `package.json` no tiene `"type": "module"`. Mezclar rompe Node.js  
**Impacto:** `prisma.config.js` usa ESM — ignorar o convertir al migrar Prisma  

---

## [2026-05-27] Pool pg directo + Prisma en paralelo
**Decisión:** El backend usa `pg` Pool directamente en `models/db.js`, Prisma está declarado pero no se usa aún en las queries  
**Motivo:** El proyecto arrancó con pg raw y Prisma se agregó después  
**Impacto:** Al refactorizar, migrar queries a Prisma Client y eliminar el pool directo  

---

## [2026-05-27] Controladores como re-exports
**Decisión:** `controllers/ganado.js` solo hace `module.exports = require("../src/ganado")`  
**Motivo:** Patrón para escalar — cuando se agregue lógica de permisos por rol, va en controllers  
**Impacto:** Ninguno aún. No eliminar la carpeta, tiene propósito futuro  

---

## [2026-05-27] JWT con expiración 1 hora
**Decisión:** Token expira en `1h`  
**Motivo:** Balance seguridad / usabilidad en campo  
**Impacto:** Frontend debe manejar token expirado y redirigir a login  

---

## [2026-05-27] Frontend objetivo: React + Vite + PWA
**Decisión:** Migrar frontend de HTML vanilla a React + Vite  
**Motivo:** Soporte offline (IndexedDB), escalabilidad, componentes reutilizables  
**Impacto:** Reestructuración completa del frontend. HTML actual queda como referencia  

---

## [2026-05-27] CORS abierto en desarrollo
**Decisión:** `app.use(cors())` sin restricciones  
**Motivo:** Desarrollo local  
**Impacto:** En producción cambiar a `cors({ origin: "https://dominio-real.com" })`  
