# Stage 1: Build the Go application
FROM golang:1.21-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy go.mod and go.sum and download dependencies
COPY backend/go.mod backend/go.sum ./backend/
RUN cd backend && go mod download

# Copy the entire backend source code
COPY backend/ ./backend/

# Set the working directory to the backend
WORKDIR /app/backend/

# Build the Go application
RUN CGO_ENABLED=0 GOOS=linux go build -o /app/server ./cmd/server/main.go

# Stage 2: Prepare the runtime environment
FROM alpine:latest

# Set the working directory
WORKDIR /app

# Copy the built binary from the builder stage
COPY --from=builder /app/server /app/server

# Copy the configuration files
COPY backend/configs /app/configs

# Expose the port the backend serves on
EXPOSE 8080

# Set the entrypoint
ENTRYPOINT ["/app/server"]
