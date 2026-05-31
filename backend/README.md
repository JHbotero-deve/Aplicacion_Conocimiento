# Proyecto Ganaderia - Backend

API REST con Node.js + Express + PostgreSQL.

## Requisitos
- Node.js 18+
- PostgreSQL

## Configuracion
Crear `backend/.env`:

```env
PORT=3000
DATABASE_URL="postgresql://postgres:1100@localhost:5432/ganaderia"
JWT_SECRET="clave_super_segura"
```

## Instalacion y ejecucion
```bash
cd backend
npm install
npm run start
```

## Endpoints principales
- `GET /ping`
- `GET /health`
- `POST /usuarios` (registro)
- `POST /usuarios/login` (login)
- `GET /usuarios`
- `POST /ganado` (requiere Bearer token)
- `GET /ganado` (requiere Bearer token)
- `PUT /ganado/bloquear/:id` (requiere Bearer token)
- `GET /ganado/chapeta/:chapeta` (requiere Bearer token)

## SQL base sugerido
```sql
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nombre_usuario VARCHAR(50) UNIQUE NOT NULL,
  contrasena_hash VARCHAR(255) NOT NULL,
  rol_usuario VARCHAR(20) NOT NULL DEFAULT 'usuario',
  fecha_creacion TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ganado (
  id SERIAL PRIMARY KEY,
  chapeta VARCHAR(20) UNIQUE NOT NULL,
  raza VARCHAR(30) NOT NULL,
  edad INT NOT NULL,
  peso NUMERIC(10,2) NOT NULL,
  fecha_ingreso DATE NOT NULL,
  estadoica VARCHAR(20) NOT NULL DEFAULT 'pendiente',
  certificado_ica BOOLEAN NOT NULL DEFAULT false,
  bloqueado BOOLEAN NOT NULL DEFAULT false
);
```
