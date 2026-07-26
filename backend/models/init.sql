-- Sistema Ganadero Profesional - Edición "Steel Edge" (Seguridad Blindada)

-- Habilitar extensión para UUID
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Tabla de Fincas (RSPP)
CREATE TABLE IF NOT EXISTS fincas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(100) NOT NULL,
    matricula_inmobiliaria VARCHAR(50),
    extension DECIMAL(10,2),
    unidad_medida VARCHAR(20) DEFAULT 'Hectáreas',
    departamento VARCHAR(50) DEFAULT 'Cundinamarca',
    municipio VARCHAR(50),
    vereda VARCHAR(100),
    latitud VARCHAR(50),
    longitud VARCHAR(50),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla de Usuarios (Actualizada con UUID y Seguridad Offline)
CREATE TABLE IF NOT EXISTS usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre_usuario VARCHAR(50) UNIQUE NOT NULL,
    contrasena_hash TEXT NOT NULL,
    rol_usuario VARCHAR(20) NOT NULL,
    pregunta_seguridad TEXT,
    respuesta_hash TEXT,
    intentos_fallidos INTEGER DEFAULT 0,
    bloqueado_hasta TIMESTAMP,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Relación Usuario-Finca
CREATE TABLE IF NOT EXISTS usuario_finca (
    usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    finca_id UUID REFERENCES fincas(id) ON DELETE CASCADE,
    PRIMARY KEY (usuario_id, finca_id)
);

-- 4. Tabla de Ganado (Censo Pecuario Oficial con UUID)
CREATE TABLE IF NOT EXISTS ganado (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chapeta VARCHAR(50) UNIQUE NOT NULL,
    especie VARCHAR(50) DEFAULT 'Bovino',
    sexo VARCHAR(10),
    raza VARCHAR(50),
    categoria_etaria VARCHAR(50),
    edad INTEGER,
    peso DECIMAL(10,2),
    fecha_ingreso DATE,
    estadoICA VARCHAR(50),
    ruv_numero VARCHAR(50),
    hierro_descripcion TEXT,
    bloqueado INTEGER DEFAULT 0,
    finca_id UUID REFERENCES fincas(id) ON DELETE SET NULL
);

-- 5. Tratamientos Veterinarios (BPG)
CREATE TABLE IF NOT EXISTS tratamientos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ganado_id UUID REFERENCES ganado(id) ON DELETE CASCADE,
    fecha DATE DEFAULT CURRENT_DATE,
    diagnostico TEXT,
    producto VARCHAR(100),
    lote VARCHAR(50),
    dosis VARCHAR(50),
    via_administracion VARCHAR(50),
    tiempo_retiro_dias INTEGER DEFAULT 0,
    responsable_id UUID REFERENCES usuarios(id) ON DELETE SET NULL
);

-- 6. Producción Diaria (Leche/Pesaje)
CREATE TABLE IF NOT EXISTS produccion (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ganado_id UUID REFERENCES ganado(id) ON DELETE CASCADE,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tipo VARCHAR(20),
    cantidad DECIMAL(10,2),
    unidad VARCHAR(10) DEFAULT 'Litros',
    observaciones TEXT
);

-- 7. Inventario de Insumos
CREATE TABLE IF NOT EXISTS insumos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(100) NOT NULL,
    tipo VARCHAR(50),
    registro_ica VARCHAR(50),
    cantidad_actual DECIMAL(10,2),
    unidad_medida VARCHAR(20),
    fecha_vencimiento DATE,
    finca_id UUID REFERENCES fincas(id) ON DELETE CASCADE
);

-- 8. Novedades
CREATE TABLE IF NOT EXISTS novedades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ganado_id UUID REFERENCES ganado(id) ON DELETE CASCADE,
    tipo_novedad VARCHAR(50),
    fecha DATE DEFAULT CURRENT_DATE,
    descripcion TEXT,
    finca_id UUID REFERENCES fincas(id) ON DELETE CASCADE
);

-- 9. Tabla de Cuarentena (Anti-Fraude)
CREATE TABLE IF NOT EXISTS cuarentena (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    finca_id UUID REFERENCES fincas(id) ON DELETE SET NULL,
    tipo_accion VARCHAR(100) NOT NULL,
    datos_json JSONB NOT NULL,
    motivo_bloqueo TEXT,
    estado VARCHAR(20) DEFAULT 'Pendiente',
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. Citas Veterinarias
CREATE TABLE IF NOT EXISTS citas_veterinarias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    finca_id UUID REFERENCES fincas(id) ON DELETE CASCADE,
    veterinario_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    animal_id UUID REFERENCES ganado(id) ON DELETE CASCADE,
    fecha_programada TIMESTAMP NOT NULL,
    motivo VARCHAR(100),
    estado VARCHAR(20) DEFAULT 'Pendiente',
    observaciones TEXT
);

-- 11. Recetas Médicas
CREATE TABLE IF NOT EXISTS recetas_medicas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tratamiento_id UUID REFERENCES tratamientos(id) ON DELETE CASCADE,
    veterinario_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    instrucciones_detalladas TEXT,
    fecha_prescripcion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 12. Tabla de Auditoría
CREATE TABLE IF NOT EXISTS auditoria (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    accion VARCHAR(100) NOT NULL,
    descripcion TEXT,
    finca_id UUID REFERENCES fincas(id) ON DELETE SET NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ÍNDICES DE RENDIMIENTO (Optimización Steel Edge)
CREATE INDEX IF NOT EXISTS idx_ganado_chapeta ON ganado(chapeta);
CREATE INDEX IF NOT EXISTS idx_produccion_fecha ON produccion(fecha);
CREATE INDEX IF NOT EXISTS idx_auditoria_fecha ON auditoria(fecha);
CREATE INDEX IF NOT EXISTS idx_ganado_finca ON ganado(finca_id);
