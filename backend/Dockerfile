# Используем официальный Node.js образ
FROM node:20-alpine

# Создаем рабочую директорию
WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY backend/package*.json ./
RUN npm install

# Копируем исходники и собираем TypeScript
COPY backend ./
RUN npm run build

# Запускаем приложение
CMD ["node", "dist/server.js"]
