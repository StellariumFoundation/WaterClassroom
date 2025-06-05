# Makefile for the backend

# Go parameters
GOBASE := $(shell pwd)
GOPATH := $(GOBASE)/vendor:$(GOPATH)
GOBIN := $(GOBASE)/build
GOFILES := $(wildcard *.go) $(wildcard cmd/*/*.go) $(wildcard internal/*/*.go) $(wildcard internal/*/*/*.go) $(wildcard pkg/*/*.go)

# Target application details
APP_NAME := monolith_server
CMD_PATH := ./cmd/server/main.go

# Output binary path
BINARY_PATH := $(GOBIN)/$(APP_NAME)

# Default target
.PHONY: all
all: build

# Build the application
.PHONY: build
build:
	@echo "Building $(APP_NAME)..."
	@mkdir -p $(GOBIN)
	go build -o $(BINARY_PATH) $(CMD_PATH)
	@echo "$(APP_NAME) built successfully at $(BINARY_PATH)"

# Run the application
# This assumes that the necessary configurations (config.yaml, .env) are in place.
.PHONY: run
run: build
	@echo "Running $(APP_NAME)... (Ensure configs are set up in ./configs/)"
	@$(BINARY_PATH)

# Clean build artifacts
.PHONY: clean
clean:
	@echo "Cleaning build artifacts..."
	@rm -rf $(GOBIN)
	@echo "Clean complete."

# Tidy dependencies
.PHONY: tidy
tidy:
	@echo "Tidying dependencies..."
	go mod tidy
	@echo "Dependencies tidied."

# Help
.PHONY: help
help:
	@echo "Available targets:"
	@echo "  all         - Build the application (default)"
	@echo "  build       - Build the application"
	@echo "  run         - Build and run the application"
	@echo "  clean       - Remove build artifacts"
	@echo "  tidy        - Tidy Go module dependencies"
	@echo "  help        - Show this help message"
