-- Sistema Ganadero Profesional - Cumplimiento Normativo ICA (Forma 3-101)

-- 1. Tabla de Fincas (Registro Sanitario de Predio Pecuario - RSPP)
CREATE TABLE IF NOT EXISTS fincas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    matricula_inmobiliaria VARCHAR(50),
    extension DECIMAL(10,2),
    unidad_medida VARCHAR(20) DEFAULT 'Hectáreas', -- Hectáreas, Fanegadas, m2
    departamento VARCHAR(50) DEFAULT 'Cundinamarca',
    municipio VARCHAR(50),
    vereda VARCHAR(100),
    latitud VARCHAR(50),
    longitud VARCHAR(50),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla de Usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombre_usuario VARCHAR(50) UNIQUE NOT NULL,
    contrasena_hash TEXT NOT NULL,
    rol_usuario VARCHAR(20) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    intentos_fallidos INTEGER DEFAULT 0,
    bloqueado_hasta TIMESTAMP
);

-- 3. Relación Usuario-Finca
CREATE TABLE IF NOT EXISTS usuario_finca (
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    finca_id INTEGER REFERENCES fincas(id) ON DELETE CASCADE,
    PRIMARY KEY (usuario_id, finca_id)
);

-- 4. Tabla de Ganado (Censo Pecuario Oficial)
CREATE TABLE IF NOT EXISTS ganado (
    id SERIAL PRIMARY KEY,
    chapeta VARCHAR(50) UNIQUE NOT NULL,
    especie VARCHAR(50) DEFAULT 'Bovino', -- Bovino, Bufalino, Equino, Porcino, Ovino, Caprino
    sexo VARCHAR(10), -- Macho, Hembra
    raza VARCHAR(50),
    categoria_etaria VARCHAR(50), -- Cría (0-12m), Levante (1-2a), Adulto (>2a)
    edad INTEGER, -- en meses
    peso DECIMAL(10,2),
    fecha_ingreso DATE,
    estadoICA VARCHAR(50), -- Registrado, Pendiente, Vacunado
    ruv_numero VARCHAR(50), -- Registro Único de Vacunación
    hierro_descripcion TEXT, -- Descripción de la marca o hierro
    bloqueado INTEGER DEFAULT 0,
    finca_id INTEGER REFERENCES fincas(id) ON DELETE SET NULL
);

-- 5. Tabla de Auditoría
CREATE TABLE IF NOT EXISTS auditoria (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
    accion VARCHAR(100) NOT NULL,
    descripcion TEXT,
    finca_id INTEGER REFERENCES fincas(id) ON DELETE SET NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
