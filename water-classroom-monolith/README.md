# Water Classroom Monolith

This is the monolithic backend application for Water Classroom. It combines the functionality of various services into a single deployable unit.

## Prerequisites

*   Go (version 1.20 or higher recommended)
*   Access to a PostgreSQL database
*   Access to a Redis instance
*   Access to a RabbitMQ instance
*   Configuration files (`configs/config.yaml`, and potentially a `.env` file based on `.env.example`)

## Configuration

1.  Copy `configs/.env.example` to `configs/.env` and populate it with your environment-specific values (Database URIs, API keys, etc.).
2.  Alternatively, ensure all necessary environment variables are set directly in your deployment environment.
3.  Review `configs/config.yaml` for default settings; many can be overridden by environment variables.

## How to Build

You can build the monolith application using standard Go commands.

1.  **Navigate to the monolith directory:**
    ```bash
    cd water-classroom-monolith
    ```

2.  **Tidy dependencies:**
    ```bash
    go mod tidy
    ```

3.  **Build the executable:**
    To build the executable for your current operating system:
    ```bash
    go build -o build/server ./cmd/server/main.go
    ```
    This will create an executable at `build/server` (or `build\server.exe` on Windows).

4.  **Running the application:**
    Once built, you can run the application (ensure configuration is set up):
    ```bash
    ./build/server
    ```

## Running with Docker (Example - Dockerfile not created in this subtask)

A `Dockerfile` is provided to build and run the application in a container.
(Note: Actual Dockerfile creation is a separate step if not already done).

```bash
# Build the Docker image
docker build -t water-classroom-monolith .

# Run the Docker container (example, ensure ports and env vars are mapped)
# docker run -p 8080:8080 -e ENV_VAR_NAME=value water-classroom-monolith
```

## API Documentation

API endpoints are defined within the respective modules under `internal/`. Key modules include:
*   Auth (`internal/auth/`)
*   Curriculum (`internal/curriculum/`)
*   Payment (`internal/payment/`)
*   ...and others.

The API is versioned under `/api/v1/`.

(Further details on specific endpoints can be added here or linked to more detailed API documentation if generated).
