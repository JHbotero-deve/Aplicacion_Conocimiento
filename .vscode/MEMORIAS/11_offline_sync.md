# 11 — Offline y Sincronización

## Estrategia offline-first

El sistema debe funcionar sin internet. El flujo es:

```
1. Al iniciar → descargar datos del servidor a IndexedDB
2. Trabajar offline → leer/escribir en IndexedDB local
3. Registrar cambios pendientes → cola local con timestamps
4. Al detectar conexión → sincronizar automáticamente
5. Subir cambios pendientes → marcarlos como sincronizados
6. Descargar cambios nuevos del servidor
```

## Tecnología elegida
- **IndexedDB** — base de datos local en el navegador
- **Service Worker** — interceptar requests y servir desde caché
- **PWA** — instalable en celular sin app store

## Control de duplicados
- Cada registro local tendrá un `uuid` generado en el cliente
- Al sincronizar, el servidor verifica el `uuid` antes de insertar
- Conflictos resueltos por timestamp — el más reciente gana

## Tablas en IndexedDB
- `ganado` — animales registrados
- `vacunas` — registros de vacunación
- `historial` — eventos veterinarios
- `pendientes` — cola de cambios no sincronizados
- `usuarios` — datos del usuario actual

## Estado de conexión
- Detectar con `navigator.onLine`
- Escuchar eventos `online` / `offline`
- Mostrar indicador visible en la UI (verde = conectado, rojo = sin internet)
