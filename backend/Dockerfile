FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY src/ ./src/

# Create uploads directory with correct permissions
RUN mkdir -p /app/uploads/gallery /app/uploads/services /app/uploads/general
RUN chmod -R 777 /app/uploads

EXPOSE 5000

CMD ["node", "src/server.js"]
