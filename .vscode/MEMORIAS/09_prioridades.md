# 09 — Prioridades

## 🔴 Prioridad Alta (hacer ahora)

1. Corregir bugs en formularios HTML actuales
2. Centralizar `services/api.js` — eliminar fetch duplicado inline
3. Refactorizar backend → separar `routes/` y `services/`
4. Migrar queries a Prisma Client (eliminar pg raw)
5. Agregar modelos `Finca`, `Vacuna`, `Historial` en schema Prisma

## 🟡 Prioridad Media (siguiente etapa)

6. Versionar API → `/api/v1/`
7. Validaciones con Zod en backend
8. Iniciar migración frontend a React + Vite
9. Implementar `IndexedDB` para almacenamiento local
10. AutofillService — cargar datos del animal desde chapeta

## 🟢 Prioridad Baja (después)

11. PWA completo (manifest + service worker)
12. SyncService — sincronización automática
13. Dashboard con estadísticas
14. Restricción CORS para producción
15. JWT_SECRET robusto para producción
16. Animaciones / mejoras visuales

## ❌ No hacer todavía
- Animaciones complejas
- Dashboard avanzado con gráficas
- Funcionalidades no pedidas por el cliente
