FROM node:20-alpine

WORKDIR /app

COPY frontend/package*.json ./
RUN npm install

COPY frontend ./
RUN npm run build

# По умолчанию next start запускает на порту 3000
CMD ["npm", "run", "start"]
