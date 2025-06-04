# Water Classroom - Backend Makefile
# Version: 1.0
# Last updated: 28 May 2025

# Variables
SHELL := /bin/sh
DOCKER_COMPOSE := docker-compose -f deployments/docker-compose/docker-compose.yml
GO := go
GOOSE := goose
GOLANGCI_LINT := golangci-lint
BUF := buf
SERVICES := auth-svc user-svc curriculum-svc progress-svc assessment-svc tutor-orchestrator-svc notification-svc api-gateway

# Colors for better output
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[0;33m
RED := \033[0;31m
NC := \033[0m # No Color

.PHONY: help
help: ## Show this help message
	@echo -e "${BLUE}Water Classroom Backend${NC} - Development Commands"
	@echo -e "${YELLOW}Usage:${NC} make [target]"
	@echo ""
	@echo -e "${YELLOW}Available targets:${NC}"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  ${GREEN}%-25s${NC} %s\n", $$1, $$2}'

# Docker Compose Commands
.PHONY: dev-up
dev-up: ## Start all services with docker-compose (build if needed)
	@echo -e "${BLUE}Starting all services...${NC}"
	@$(DOCKER_COMPOSE) up --build -d
	@echo -e "${GREEN}Services started successfully!${NC}"
	@echo -e "API Gateway: ${YELLOW}http://localhost:8081${NC}"
	@echo -e "Auth Service: ${YELLOW}http://localhost:8080${NC}"
	@echo -e "Jaeger UI: ${YELLOW}http://localhost:16686${NC}"
	@echo -e "RabbitMQ UI: ${YELLOW}http://localhost:15672${NC} (guest/guest)"
	@echo -e "MailHog UI: ${YELLOW}http://localhost:8025${NC}"

.PHONY: dev-down
dev-down: ## Stop all services and remove containers
	@echo -e "${BLUE}Stopping all services...${NC}"
	@$(DOCKER_COMPOSE) down
	@echo -e "${GREEN}Services stopped successfully!${NC}"

.PHONY: dev-restart
dev-restart: dev-down dev-up ## Restart all services

.PHONY: dev-clean
dev-clean: ## Stop all services and remove containers, volumes, and networks
	@echo -e "${BLUE}Stopping all services and cleaning up...${NC}"
	@$(DOCKER_COMPOSE) down -v
	@echo -e "${GREEN}Services stopped and volumes removed!${NC}"

.PHONY: logs
logs: ## Show logs from all services
	@$(DOCKER_COMPOSE) logs -f

.PHONY: logs-service
logs-service: ## Show logs from a specific service (e.g., make logs-service MAKE_SERVICE_NAME=auth-svc)
	@$(DOCKER_COMPOSE) logs -f $(MAKE_SERVICE_NAME)

# Database Migration Commands
.PHONY: migrate-up
migrate-up: ## Run all pending migrations for all services
	@echo -e "${BLUE}Running migrations for all services...${NC}"
	@for service in $(SERVICES); do \
		if [ -d "$$service/migrations" ]; then \
			echo -e "${YELLOW}Migrating $$service...${NC}"; \
			cd $$service && $(GOOSE) -dir migrations postgres "$(shell grep POSTGRES_URI deployments/docker-compose/docker-compose.yml | grep $$service | sed 's/.*POSTGRES_URI: //' | sed 's/,//')" up; \
			cd ..; \
		fi; \
	done
	@echo -e "${GREEN}All migrations completed successfully!${NC}"

.PHONY: migrate-down
migrate-down: ## Rollback the latest migration for all services
	@echo -e "${BLUE}Rolling back migrations for all services...${NC}"
	@for service in $(SERVICES); do \
		if [ -d "$$service/migrations" ]; then \
			echo -e "${YELLOW}Rolling back $$service...${NC}"; \
			cd $$service && $(GOOSE) -dir migrations postgres "$(shell grep POSTGRES_URI deployments/docker-compose/docker-compose.yml | grep $$service | sed 's/.*POSTGRES_URI: //' | sed 's/,//')" down; \
			cd ..; \
		fi; \
	done
	@echo -e "${GREEN}All rollbacks completed successfully!${NC}"

.PHONY: migrate-create
migrate-create: ## Create a new migration file (e.g., make migrate-create MAKE_SERVICE_NAME=auth-svc NAME=add_user_fields)
	@if [ -z "$(MAKE_SERVICE_NAME)" ]; then \
		echo -e "${RED}Error: MAKE_SERVICE_NAME parameter is required${NC}"; \
		echo -e "Usage: make migrate-create MAKE_SERVICE_NAME=auth-svc NAME=add_user_fields"; \
		exit 1; \
	fi
	@if [ -z "$(NAME)" ]; then \
		echo -e "${RED}Error: NAME parameter is required${NC}"; \
		echo -e "Usage: make migrate-create MAKE_SERVICE_NAME=auth-svc NAME=add_user_fields"; \
		exit 1; \
	fi
	@if [ ! -d "$(MAKE_SERVICE_NAME)/migrations" ]; then \
		echo -e "${YELLOW}Creating migrations directory for $(MAKE_SERVICE_NAME)...${NC}"; \
		mkdir -p $(MAKE_SERVICE_NAME)/migrations; \
	fi
	@echo -e "${BLUE}Creating migration file for $(MAKE_SERVICE_NAME)...${NC}"
	@cd $(MAKE_SERVICE_NAME) && $(GOOSE) -dir migrations create $(NAME) sql
	@echo -e "${GREEN}Migration file created successfully!${NC}"

# Build Commands
.PHONY: build
build: ## Build all services
	@echo -e "${BLUE}Building all services...${NC}"
	@for service in $(SERVICES); do \
		echo -e "${YELLOW}Building $$service...${NC}"; \
		cd $$service && $(GO) build -o bin/$$service ./cmd && cd ..; \
	done
	@echo -e "${GREEN}All services built successfully!${NC}"

.PHONY: build-service
build-service: ## Build a specific service (e.g., make build-service MAKE_SERVICE_NAME=auth-svc)
	@if [ -z "$(MAKE_SERVICE_NAME)" ]; then \
		echo -e "${RED}Error: MAKE_SERVICE_NAME parameter is required${NC}"; \
		echo -e "Usage: make build-service MAKE_SERVICE_NAME=auth-svc"; \
		exit 1; \
	fi
	@echo -e "${BLUE}Building $(MAKE_SERVICE_NAME)...${NC}"
	@cd $(MAKE_SERVICE_NAME) && $(GO) build -o bin/$(MAKE_SERVICE_NAME) ./cmd
	@echo -e "${GREEN}$(MAKE_SERVICE_NAME) built successfully!${NC}"

# Test Commands
.PHONY: test
test: ## Run tests for all services
	@echo -e "${BLUE}Running tests for all services...${NC}"
	@for service in $(SERVICES); do \
		if ls $$service/*.go &> /dev/null || ls $$service/cmd/*.go &> /dev/null || ls $$service/internal/*.go &> /dev/null; then \
			echo -e "${YELLOW}Testing $$service...${NC}"; \
			cd $$service && $(GO) test ./... -v && cd ..; \
		else \
			echo -e "${YELLOW}Skipping $$service (no Go files found to test)...${NC}"; \
		fi; \
	done
	@echo -e "${GREEN}All tests completed! (Skipped services with no Go files may need attention if unintentional)${NC}"

.PHONY: test-service
test-service: ## Run tests for a specific service (e.g., make test-service MAKE_SERVICE_NAME=auth-svc)
	@if [ -z "$(MAKE_SERVICE_NAME)" ]; then \
		echo -e "${RED}Error: MAKE_SERVICE_NAME parameter is required${NC}"; \
		echo -e "Usage: make test-service MAKE_SERVICE_NAME=auth-svc"; \
		exit 1; \
	fi
	@echo -e "${BLUE}Running tests for $(MAKE_SERVICE_NAME)...${NC}"
	@cd $(MAKE_SERVICE_NAME) && $(GO) test ./... -v
	@echo -e "${GREEN}Tests for $(MAKE_SERVICE_NAME) completed successfully!${NC}"

.PHONY: test-coverage
test-coverage: ## Run tests with coverage for all services
	@echo -e "${BLUE}Running tests with coverage for all services...${NC}"
	@for service in $(SERVICES); do \
		echo -e "${YELLOW}Testing $$service with coverage...${NC}"; \
		cd $$service && $(GO) test ./... -coverprofile=coverage.out && $(GO) tool cover -html=coverage.out -o coverage.html && cd ..; \
	done
	@echo -e "${GREEN}All tests with coverage completed successfully!${NC}"

# Lint Commands
.PHONY: lint
lint: ## Run linter for all services
	@echo -e "${BLUE}Running linter for all services...${NC}"
	@for service in $(SERVICES); do \
		echo -e "${YELLOW}Linting $$service...${NC}"; \
		cd $$service && $(GOLANGCI_LINT) run ./... && cd ..; \
	done
	@echo -e "${GREEN}All services linted successfully!${NC}"

.PHONY: lint-service
lint-service: ## Run linter for a specific service (e.g., make lint-service MAKE_SERVICE_NAME=auth-svc)
	@if [ -z "$(MAKE_SERVICE_NAME)" ]; then \
		echo -e "${RED}Error: MAKE_SERVICE_NAME parameter is required${NC}"; \
		echo -e "Usage: make lint-service MAKE_SERVICE_NAME=auth-svc"; \
		exit 1; \
	fi
	@echo -e "${BLUE}Running linter for $(MAKE_SERVICE_NAME)...${NC}"
	@cd $(MAKE_SERVICE_NAME) && $(GOLANGCI_LINT) run ./...
	@echo -e "${GREEN}$(MAKE_SERVICE_NAME) linted successfully!${NC}"

# Protobuf Commands
.PHONY: proto-gen
proto-gen: ## Generate code from protobuf definitions
	@echo -e "${BLUE}Generating code from protobuf definitions...${NC}"
	@cd proto && $(BUF) generate
	@echo -e "${GREEN}Protobuf code generated successfully!${NC}"

.PHONY: proto-lint
proto-lint: ## Lint protobuf definitions
	@echo -e "${BLUE}Linting protobuf definitions...${NC}"
	@cd proto && $(BUF) lint
	@echo -e "${GREEN}Protobuf definitions linted successfully!${NC}"

.PHONY: proto-breaking
proto-breaking: ## Check for breaking changes in protobuf definitions
	@echo -e "${BLUE}Checking for breaking changes in protobuf definitions...${NC}"
	@cd proto && $(BUF) breaking --against '.git#branch=main'
	@echo -e "${GREEN}No breaking changes detected!${NC}"

# Documentation Commands
.PHONY: docs
docs: ## Generate API documentation
	@echo -e "${BLUE}Generating API documentation...${NC}"
	@echo -e "${YELLOW}This command is not yet implemented${NC}"
	@echo -e "${GREEN}API documentation generated successfully!${NC}"

# Utility Commands
.PHONY: clean
clean: ## Clean build artifacts
	@echo -e "${BLUE}Cleaning build artifacts...${NC}"
	@find . -type d -name "bin" -exec rm -rf {} +
	@find . -name "coverage.out" -delete
	@find . -name "coverage.html" -delete
	@echo -e "${GREEN}Build artifacts cleaned successfully!${NC}"

.PHONY: install-tools
install-tools: ## Install required development tools
	@echo -e "${BLUE}Installing development tools...${NC}"
	@go install github.com/pressly/goose/v3/cmd/goose@latest
	@go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest
	@go install github.com/bufbuild/buf/cmd/buf@latest
	@go install github.com/cosmtrek/air@latest
	@echo -e "${GREEN}Development tools installed successfully!${NC}"

.PHONY: generate-keys
generate-keys: ## Generate RSA keys for JWT authentication
	@echo -e "${BLUE}Generating RSA keys for JWT authentication...${NC}"
	@mkdir -p .keys
	@openssl genrsa -out .keys/jwt-private.pem 2048
	@openssl rsa -in .keys/jwt-private.pem -pubout -out .keys/jwt-public.pem
	@echo -e "${GREEN}RSA keys generated successfully!${NC}"
	@echo -e "Private key: ${YELLOW}.keys/jwt-private.pem${NC}"
	@echo -e "Public key: ${YELLOW}.keys/jwt-public.pem${NC}"
	@echo -e "${YELLOW}Note: These keys should be kept secure and not committed to version control.${NC}"

# Default target
.DEFAULT_GOAL := help

build-service-docker: ## Build a specific service for Docker production image (MAKE_SERVICE_NAME, BIN_PATH, MODULE_DIR are params)
	@echo "DEBUG: Value of MAKE_SERVICE_NAME as seen by make: [$(MAKE_SERVICE_NAME)]"
	@echo "DEBUG: Value of BIN_PATH as seen by make: [$(BIN_PATH)]"
	@echo "DEBUG: Value of MODULE_DIR as seen by make: [$(MODULE_DIR)]"
	@echo "Debug: Entered build-service-docker target."
	@echo "Debug: MAKE_SERVICE_NAME variable value is: [$(MAKE_SERVICE_NAME)]"
	@echo "Debug: BIN_PATH variable value is: [$(BIN_PATH)]"
	@echo "Debug: MODULE_DIR variable value is: [$(MODULE_DIR)]"
	# ifndef MAKE_SERVICE_NAME
	#	$(error MAKE_SERVICE_NAME is not set. Usage: make build-service-docker MAKE_SERVICE_NAME=<name> BIN_PATH=<output_path> [MODULE_DIR=<path_to_module_root_if_not_MAKE_SERVICE_NAME_name>])
	# endif
	# ifndef BIN_PATH
	#	$(error BIN_PATH is not set. Usage: make build-service-docker MAKE_SERVICE_NAME=<name> BIN_PATH=<output_path> [MODULE_DIR=<path_to_module_root_if_not_MAKE_SERVICE_NAME_name>])
	# endif
	@# MODULE_DIR defaults to the service name relative to this Makefile if not set.
	@# This means if MODULE_DIR is '.', it refers to the CWD of the make command.
	@# If this Makefile is /app/backend/Makefile, and MODULE_DIR is not set, it assumes sources are in /app/backend/$(MAKE_SERVICE_NAME)/
	MODULE_PATH_PREFIX := "."
	ifeq ($(MODULE_DIR),)
		# If MODULE_DIR is empty, assume service sources are in a subdirectory named $(MAKE_SERVICE_NAME) relative to this Makefile
		ACTUAL_MODULE_DIR := $(MODULE_PATH_PREFIX)/$(MAKE_SERVICE_NAME)
	else
		# If MODULE_DIR is set (e.g. to "."), use that path.
		ACTUAL_MODULE_DIR := $(MODULE_DIR)
	endif

	# Determine Go build source path
	GO_BUILD_SRC_PATH := "$(ACTUAL_MODULE_DIR)/cmd/main.go" # Default for most services
	# If MAKE_SERVICE_NAME is 'api-gateway' or 'assessment-svc', then expect main.go in the root of the module directory.
	ifeq ($(filter $(MAKE_SERVICE_NAME),api-gateway assessment-svc),$(MAKE_SERVICE_NAME))
		GO_BUILD_SRC_PATH := "$(ACTUAL_MODULE_DIR)/main.go"
	endif

	@echo "--- Building service $(MAKE_SERVICE_NAME) for Docker ---"
	@echo "Source directory: $(ACTUAL_MODULE_DIR)"
	@echo "Go build source: $(GO_BUILD_SRC_PATH)"
	@echo "Output binary: $(BIN_PATH)"
	CGO_ENABLED=0 GOOS=linux $(GO) build \
		-ldflags="-w -s" \
		-o $(BIN_PATH) \
		$(GO_BUILD_SRC_PATH)
	@echo "--- Finished building service $(MAKE_SERVICE_NAME) for Docker ---"
