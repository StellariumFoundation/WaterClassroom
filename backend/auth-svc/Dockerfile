# Build stage
FROM golang:1.22-alpine AS builder

# Install build dependencies
RUN apk add --no-cache git # Remains

WORKDIR /app

COPY Makefile /app/Makefile
COPY backend/Makefile /app/backend/Makefile
COPY backend/auth-svc /app/backend/auth-svc # Copies the auth-svc go.mod, source, configs etc.

WORKDIR /app/backend # build-service target is relative to backend dir

RUN make build-service SERVICE=auth-svc
# Binary will be at /app/backend/auth-svc/bin/auth-svc
# Configs will be at /app/backend/auth-svc/configs

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
COPY --from=builder /app/backend/auth-svc/bin/auth-svc .
COPY --from=builder /app/backend/auth-svc/configs ./configs

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
