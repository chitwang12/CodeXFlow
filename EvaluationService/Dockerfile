FROM node:18-alpine

WORKDIR /app

# Docker CLI is required for code execution
RUN apk add --no-cache docker-cli

COPY package*.json ./
RUN npm install --only=production

COPY . .
RUN npm run build

EXPOSE 3003

CMD ["node", "dist/index.js"]
