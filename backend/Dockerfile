FROM node:18-slim

# Crear un usuario no privilegiado para seguridad (Steel Edge)
RUN groupadd -r nodejs && useradd -r -g nodejs ganadero

# Directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias y limpiar cache para reducir superficie de ataque
RUN npm install --production && npm cache clean --force

# Copiar el código del sistema
COPY --chown=ganadero:nodejs . .

# Cambiar al usuario limitado
USER ganadero

# Exponer puerto de operación
EXPOSE 8000

# Comando de inicio seguro
CMD ["npm", "start"]
