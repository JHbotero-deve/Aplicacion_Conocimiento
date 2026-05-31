# 02 — Arquitectura

## Stack oficial aprobado

### Backend
- Node.js + Express
- Prisma ORM
- PostgreSQL
- JWT (jsonwebtoken)
- bcrypt
- dotenv

### Frontend (actual → a migrar)
- Actual: HTML vanilla + Tailwind CDN
- Objetivo: React + Vite + Tailwind + PWA + IndexedDB

### Infraestructura
- Docker + docker-compose
- Puerto backend: 3000

## Arquitectura general
```
Frontend PWA (React + Vite)
        ↓
API REST Backend (Express)
        ↓
PostgreSQL (Prisma ORM)
```

## Estructura backend actual (funcional)
```
backend/
├── src/
│   ├── ganado.js       ← lógica ganado
│   ├── usuarios.js     ← lógica usuarios
│   └── server.js       ← entry point, rutas registradas
├── controllers/        ← re-exportan src/ (patrón para crecer)
├── middleware/
│   └── auth.js         ← JWT middleware
├── models/
│   └── db.js           ← pool PostgreSQL
├── prisma/
│   └── schema.prisma   ← modelos Usuario y Ganado
├── scripts/
├── seed.js
├── .env
└── package.json
```

## Estructura backend objetivo (profesional)
```
backend/
├── src/
│   ├── config/         ← DB, JWT, env
│   ├── controllers/    ← HTTP request/response
│   ├── middleware/     ← auth, errorHandler, logger
│   ├── prisma/         ← schema + migrations
│   ├── routes/         ← definición de endpoints
│   ├── services/       ← lógica de negocio real
│   ├── validators/     ← validaciones con Zod
│   ├── utils/          ← helpers reutilizables
│   ├── app.js
│   └── server.js
```

## Endpoints actuales operativos
```
POST   /usuarios              ← registro
GET    /usuarios              ← listar
POST   /usuarios/login        ← login → retorna JWT
POST   /register              ← alias legacy
POST   /login                 ← alias legacy
POST   /ganado         [JWT]  ← ingresar ganado
GET    /ganado         [JWT]  ← listar ganado
PUT    /ganado/bloquear/:id [JWT] ← bloquear
GET    /ganado/chapeta/:chapeta [JWT] ← buscar por chapeta
GET    /ping                  ← health DB
GET    /health                ← health servidor
```

## Endpoints objetivo (versionados)
```
/api/v1/auth
/api/v1/ganado
/api/v1/fincas
/api/v1/vacunas
/api/v1/historial
/api/v1/sync
```
