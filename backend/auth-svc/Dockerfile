# Build stage
FROM golang:1.22-alpine AS builder

# Install build dependencies
RUN apk add --no-cache git

# Set working directory
WORKDIR /build

# Copy go mod and sum files
COPY go.mod go.sum ./

# Run go mod tidy to ensure go.sum is correct
RUN go mod tidy

# Download dependencies
RUN go mod download

# Copy the source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-w -s" -o auth-service ./cmd

# Final stage
FROM alpine:3.19

# Install CA certificates for HTTPS
RUN apk --no-cache add ca-certificates tzdata && \
    update-ca-certificates

# Create a non-root user and group
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Set working directory
WORKDIR /app

# Copy the binary from the builder stage
COPY --from=builder /build/auth-service .
COPY --from=builder /build/configs ./configs

# Use the non-root user
USER appuser

# Expose ports
EXPOSE 8080 50051

# Set environment variables
ENV ENV=production \
    TZ=UTC

# Command to run when container starts
# Use exec form for proper signal handling
ENTRYPOINT ["/app/auth-service"]
