# Use Node.js 18 as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install dependencies
RUN cd backend && npm install
RUN cd frontend && npm install

# Copy source code
COPY backend ./backend
COPY frontend ./frontend

# Build frontend
RUN cd frontend && npm run build

# Expose ports
EXPOSE 5000 3000

# Create startup script
RUN echo '#!/bin/sh\n\
cd backend && npm run dev &\n\
cd frontend && npm start\n\
wait' > /app/start.sh && chmod +x /app/start.sh

# Start the application
CMD ["/app/start.sh"] 