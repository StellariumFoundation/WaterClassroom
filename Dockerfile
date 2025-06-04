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
COPY frontend/Makefile /app/frontend/Makefile

# Install dependencies
RUN apk add --no-cache make
RUN make install-deps
# RUN pnpm install --frozen-lockfile # Uncomment if using pnpm

# Build the SvelteKit application for static export
RUN make build
# The output will be in /app/frontend/build (by default for adapter-static)

# Stage 2: Backend Build (All go microsevices)
FROM golang:1.24-alpine AS go-builder

WORKDIR /app/


COPY backend/Makefile /app/Makefile
# Download Go module dependencies and bash
RUN apk add --no-cache make bash
RUN echo "--- Contents of /app/backend/Makefile before make execution: ---" && cat /app/backend/Makefile && echo "--- End of /app/backend/Makefile contents ---"

RUN cd /app/backend && make build-docker

# Stage 3: Final Production Image
FROM alpine:3.19

WORKDIR /app

# Set default port for the Go application
COPY --from=go-builder /apps

COPY --from=frontend-builder /app/frontend/build ./static_frontend

# Expose the port the Go application will listen on
EXPOSE 8080

# Set the entrypoint for the container
ENTRYPOINT ["/app/app"]
