# Stage 1: Frontend Build
FROM node:18-alpine AS frontend-builder

ARG GEMINI_API_KEY
ENV VITE_GEMINI_API_KEY=$GEMINI_API_KEY
ENV NODE_ENV=production

WORKDIR /app/frontend

# Copy package files
COPY frontend/package.json frontend/package-lock.json* ./
#COPY frontend/pnpm-lock.yaml ./ # Uncomment if using pnpm

# Copy the rest of the frontend application code
COPY frontend/. .

# Install dependencies
RUN npm install --legacy-peer-deps
RUN npm install @sveltejs/kit
# RUN pnpm install --frozen-lockfile # Uncomment if using pnpm

# Build the SvelteKit application for static export
RUN npx vite build
# The output will be in /app/frontend/build (by default for adapter-static)

# Stage 2: Backend Build (Go API Gateway)
FROM golang:1.24-alpine AS go-builder

WORKDIR /app/backend/api-gateway

# Copy Go module files
COPY backend/api-gateway/go.mod backend/api-gateway/go.sum ./

# Download Go module dependencies
RUN go mod download

# Copy the rest of the API gateway source code
COPY backend/api-gateway/. .

# Build the Go application
# CGO_ENABLED=0 for static linking (optional, but good for alpine)
# GOOS=linux to ensure Linux binary
# -ldflags="-s -w" to strip debug information and reduce binary size (optional)
RUN CGO_ENABLED=0 GOOS=linux go build -v -o /app/api-gateway -ldflags="-s -w" .
# The compiled binary will be at /app/api-gateway

# Stage 3: Final Production Image
FROM alpine:3.19

WORKDIR /app

# Set default port for the Go application
ENV SERVER_PORT=8080
# Ensure Go app can find static files relative to its execution path if needed.
# The Go app is configured to look for "./static_frontend".
# So, if WORKDIR is /app, and binary is /app/api-gateway, it looks for /app/static_frontend.

# Copy the compiled Go binary from the go-builder stage
COPY --from=go-builder /app/api-gateway /app/api-gateway

# Copy the static frontend assets from the frontend-builder stage
# The Go application is configured to serve files from "./static_frontend"
COPY --from=frontend-builder /app/frontend/build ./static_frontend

# Expose the port the Go application will listen on
EXPOSE 8080

# Set the entrypoint for the container
ENTRYPOINT ["/app/api-gateway"]

# Optional: Add a basic healthcheck
# (Requires wget in alpine and a /health endpoint in the Go app)
