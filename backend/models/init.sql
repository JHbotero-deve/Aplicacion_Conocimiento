-- Sistema Ganadero Profesional - Ecosistema Operativo Integral (ICA/BPG)

-- 1. Tabla de Fincas (RSPP)
CREATE TABLE IF NOT EXISTS fincas (
    id SERIAL PRIMARY KEY,
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

-- 2. Tabla de Usuarios (Actualizada con Seguridad Offline)
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
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
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    finca_id INTEGER REFERENCES fincas(id) ON DELETE CASCADE,
    PRIMARY KEY (usuario_id, finca_id)
);

-- 4. Tabla de Ganado (Censo Pecuario Oficial)
CREATE TABLE IF NOT EXISTS ganado (
    id SERIAL PRIMARY KEY,
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
    finca_id INTEGER REFERENCES fincas(id) ON DELETE SET NULL
);

-- 5. Tratamientos Veterinarios (BPG)
CREATE TABLE IF NOT EXISTS tratamientos (
    id SERIAL PRIMARY KEY,
    ganado_id INTEGER REFERENCES ganado(id) ON DELETE CASCADE,
    fecha DATE DEFAULT CURRENT_DATE,
    diagnostico TEXT,
    producto VARCHAR(100),
    lote VARCHAR(50),
    dosis VARCHAR(50),
    via_administracion VARCHAR(50), -- Intramuscular, Oral, etc.
    tiempo_retiro_dias INTEGER DEFAULT 0,
    responsable_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL
);

-- 6. Producción Diaria (Leche/Pesaje)
CREATE TABLE IF NOT EXISTS produccion (
    id SERIAL PRIMARY KEY,
    ganado_id INTEGER REFERENCES ganado(id) ON DELETE CASCADE,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tipo VARCHAR(20), -- Leche, Carne (Pesaje)
    cantidad DECIMAL(10,2),
    unidad VARCHAR(10) DEFAULT 'Litros', -- Litros, Kilos
    observaciones TEXT
);

-- 7. Inventario de Insumos
CREATE TABLE IF NOT EXISTS insumos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    tipo VARCHAR(50), -- Medicamento, Alimento, Herramienta
    registro_ica VARCHAR(50),
    cantidad_actual DECIMAL(10,2),
    unidad_medida VARCHAR(20),
    fecha_vencimiento DATE,
    finca_id INTEGER REFERENCES fincas(id) ON DELETE CASCADE
);

-- 8. Novedades (Partos, Muertes, Ventas)
CREATE TABLE IF NOT EXISTS novedades (
    id SERIAL PRIMARY KEY,
    ganado_id INTEGER REFERENCES ganado(id) ON DELETE CASCADE,
    tipo_novedad VARCHAR(50), -- Parto, Muerte, Venta, Traslado
    fecha DATE DEFAULT CURRENT_DATE,
    descripcion TEXT,
    finca_id INTEGER REFERENCES fincas(id) ON DELETE CASCADE
);

-- 9. Citas Veterinarias
CREATE TABLE IF NOT EXISTS citas_veterinarias (
    id SERIAL PRIMARY KEY,
    finca_id INTEGER REFERENCES fincas(id) ON DELETE CASCADE,
    veterinario_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
    animal_id INTEGER REFERENCES ganado(id) ON DELETE CASCADE,
    fecha_programada TIMESTAMP NOT NULL,
    motivo VARCHAR(100), -- Vacunación, Chequeo, Cirugía, Urgencia
    estado VARCHAR(20) DEFAULT 'Pendiente', -- Pendiente, Completada, Cancelada
    observaciones TEXT
);

-- 10. Campañas de Vacunación (Masivas)
CREATE TABLE IF NOT EXISTS campanas_vacunacion (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    fecha_inicio DATE,
    fecha_fin DATE,
    especie_objetivo VARCHAR(50),
    insumo_id INTEGER REFERENCES insumos(id) ON DELETE SET NULL,
    estado VARCHAR(20) DEFAULT 'Programada' -- Programada, En Curso, Finalizada
);

-- 11. Recetas y Prescripciones Médicas
CREATE TABLE IF NOT EXISTS recetas_medicas (
    id SERIAL PRIMARY KEY,
    tratamiento_id INTEGER REFERENCES tratamientos(id) ON DELETE CASCADE,
    veterinario_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
    instrucciones_detalladas TEXT,
    fecha_prescripcion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 12. Tabla de Auditoría (Ya existe, aseguramos que esté al final)
CREATE TABLE IF NOT EXISTS auditoria (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
    accion VARCHAR(100) NOT NULL,
    descripcion TEXT,
    finca_id INTEGER REFERENCES fincas(id) ON DELETE SET NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
