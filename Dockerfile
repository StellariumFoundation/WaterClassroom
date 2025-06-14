# Stage 1: Build the application using the root Makefile
FROM golang:1.21-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy the entire project
COPY . .

# Install bun
RUN apk add --no-cache curl
RUN curl -fsSL https://bun.sh/install | sh
ENV PATH="/root/.bun/bin:$PATH"

# Run the build command from the root Makefile
# This will build both backend and frontend
RUN make build

# Stage 2: Prepare the runtime environment
FROM alpine:latest

# Set the working directory
WORKDIR /app

# Copy the built backend binary from the builder stage
COPY --from=builder /app/backend/server /app/server

# Copy the frontend static assets from the builder stage
COPY --from=builder /app/frontend/dist /app/frontend/dist

# Copy the configuration files
COPY backend/configs /app/configs

# Expose the port the backend serves on
EXPOSE 8080

# Set the entrypoint
ENTRYPOINT ["/app/server"]
