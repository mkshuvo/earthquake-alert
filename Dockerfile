# Build stage
FROM node:24-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application with environment variables
ARG NEXT_PUBLIC_API_URL=http://host.docker.internal:6000/api
ARG NEXT_PUBLIC_WEBSOCKET_URL=http://host.docker.internal:6000
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_WEBSOCKET_URL=${NEXT_PUBLIC_WEBSOCKET_URL}

RUN echo "Building with NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}" && \
    echo "Building with NEXT_PUBLIC_WEBSOCKET_URL=${NEXT_PUBLIC_WEBSOCKET_URL}" && \
    npm run build

# Runtime stage
FROM node:24-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy built application from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Set runtime environment variables
ENV NEXT_PUBLIC_API_URL=http://host.docker.internal:6000/api
ENV NEXT_PUBLIC_WEBSOCKET_URL=http://host.docker.internal:6000

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start application
CMD ["npm", "start"]
