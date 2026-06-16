FROM node:18-bullseye-slim

WORKDIR /app

RUN apt-get update && apt-get upgrade -y && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

ENV NODE_ENV=production
RUN npm ci --only=production --no-audit --no-fund

COPY . .

RUN useradd --user-group --create-home --shell /bin/false appuser && chown -R appuser:appuser /app
USER appuser
