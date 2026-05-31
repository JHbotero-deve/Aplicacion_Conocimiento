# 13 — Despliegue

## Ambiente de desarrollo actual

### Requisitos
- Node.js 18+
- PostgreSQL 15+
- Docker (opcional pero recomendado)

### Levantar backend
```bash
cd backend
npm install
# Configurar .env con DATABASE_URL y JWT_SECRET
npx prisma migrate dev --name init
node seed.js
npm run dev
```

### Variables de entorno requeridas (.env)
```
DATABASE_URL="postgresql://postgres:1100@localhost:5432/ganaderia"
JWT_SECRET="clave_super_segura"
PORT=3000
```

### Con Docker
```bash
docker compose up -d
```

## Usuarios de prueba (seed)
| Usuario   | Contraseña | Rol     |
|-----------|------------|---------|
| admin     | 1234       | admin   |
| usuario1  | abcd       | usuario |

## Ganado de prueba (seed)
| Chapeta | Raza     | Estado |
|---------|----------|--------|
| CH-001  | Holstein | activo |
| CH-002  | Brahman  | activo |
| CH-003  | Jersey   | activo |

## Pendiente para producción
- [ ] Variables de entorno reales (no las de desarrollo)
- [ ] JWT_SECRET robusto
- [ ] CORS restringido
- [ ] HTTPS
- [ ] Base de datos en servidor real
- [ ] CI/CD pipeline
