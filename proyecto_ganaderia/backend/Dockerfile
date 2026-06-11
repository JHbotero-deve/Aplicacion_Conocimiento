FROM node:18

# Directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer puerto (el mismo que usas en tu server.js)
EXPOSE 8000

# Comando de inicio
CMD ["npm", "start"]
