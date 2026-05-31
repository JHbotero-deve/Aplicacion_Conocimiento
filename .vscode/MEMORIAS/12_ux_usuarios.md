# 12 — UX Usuarios

## Principios de diseño para campo

- **Máximo 3 acciones por pantalla**
- **Botones grandes** — uso con guantes o dedos gruesos en campo
- **Texto grande y legible** — uso bajo sol directo
- **Preferir selectores sobre texto libre**
- **Autocompletado desde chapeta** — el usuario no debe reingresar datos ya registrados
- **Confirmaciones claras** — mensajes de éxito/error visibles, no solo alertas

## Flujo correcto (objetivo)
```
Usuario escanea o escribe chapeta
         ↓
Sistema carga automáticamente:
  - nombre del animal
  - raza
  - edad
  - finca
  - propietario
  - historial de vacunas
  - último evento veterinario
         ↓
Usuario solo completa los campos nuevos
```

## Flujo actual (mejorar)
- Formulario manual completo sin autocompletado
- Sin historial visible
- Sin indicador de conexión

## Colores y estilo actual
- Verde (`green-700`, `emerald-500`) — color principal del sistema
- Gradiente verde para fondos
- Tailwind CSS

## Pantallas existentes
1. `index.html` — bienvenida, acceso a login y registro
2. `forms/login.html` — autenticación
3. `forms/registro.html` — crear usuario
4. `forms/registro_ganado.html` — formulario ICA completo

## Pantallas por crear
5. Búsqueda por chapeta con autocompletado
6. Historial veterinario del animal
7. Registro de vacunación
8. Panel de sincronización (estado offline/online)
