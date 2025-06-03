# Water Classroom - Root Makefile
# This Makefile provides commands for building, testing, and running both frontend and backend components
# Version: 1.0.0
# Date: May 30, 2025

# Make all targets PHONY to ensure they always run
.PHONY: help build-backend-dev-images run-backend-dev stop-backend-dev logs-backend-dev test-backend build-auth-svc-prod-image \
        build-frontend-for-docker build-api-gateway-for-docker \
        install build test clean cloud-test-build

# Variables
SHELL := /bin/bash
BACKEND_DIR := backend
DOCKER_COMPOSE := docker-compose -f $(BACKEND_DIR)/deployments/docker-compose/docker-compose.yml

# Colors for better output
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[0;33m
RED := \033[0;31m
NC := \033[0m # No Color

# Default target
.DEFAULT_GOAL := help

# Help command - displays available commands with descriptions
help: ## Show this help message
	@echo -e "${BLUE}Water Classroom${NC} - Build & Run Commands"
	@echo -e "${YELLOW}Usage:${NC} make [target]"
	@echo ""
	@echo -e "${YELLOW}Available targets:${NC}"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  ${GREEN}%-30s${NC} %s\n", $$1, $$2}"

# Backend Commands
build-backend-dev-images: ## Build development Docker images for all backend services
	@echo -e "${BLUE}Building development Docker images for backend services...${NC}"
	@$(DOCKER_COMPOSE) build --no-cache
	@echo -e "${GREEN}Backend development Docker images built successfully!${NC}"

run-backend-dev: ## Start all backend services in development mode
	@echo -e "${BLUE}Starting backend services in development mode...${NC}"
	@make -C $(BACKEND_DIR) dev-up
	@echo -e "${GREEN}Backend services started successfully!${NC}"
	@echo -e "API Gateway: ${YELLOW}http://localhost:8081${NC}"
	@echo -e "Auth Service: ${YELLOW}http://localhost:8080${NC}"
	@echo -e "Jaeger UI: ${YELLOW}http://localhost:16686${NC}"
	@echo -e "RabbitMQ UI: ${YELLOW}http://localhost:15672${NC} (guest/guest)"
	@echo -e "MailHog UI: ${YELLOW}http://localhost:8025${NC}"

stop-backend-dev: ## Stop all backend services
	@echo -e "${BLUE}Stopping backend services...${NC}"
	@make -C $(BACKEND_DIR) dev-down
	@echo -e "${GREEN}Backend services stopped successfully!${NC}"

logs-backend-dev: ## View logs from all backend services
	@echo -e "${BLUE}Showing logs from backend services...${NC}"
	@make -C $(BACKEND_DIR) logs
	@echo -e "${GREEN}Log streaming ended.${NC}"

test-backend: ## Run tests for backend services
	@echo -e "${BLUE}Running backend tests...${NC}"
	@make -C $(BACKEND_DIR) test
	@echo -e "${GREEN}Backend tests completed.${NC}"

build-auth-svc-prod-image: ## Build production Docker image for auth-svc
	@echo -e "${BLUE}Building production Docker image for auth-svc...${NC}"
	@docker build -t wc-auth-svc:latest -f $(BACKEND_DIR)/auth-svc/Dockerfile $(BACKEND_DIR)/auth-svc
	@echo -e "${GREEN}auth-svc Docker image built successfully!${NC}"

# Docker Build Stage Specific Targets
build-frontend-for-docker: ## Build frontend for Docker stage
	@echo -e "${BLUE}Building frontend application for Docker...${NC}"
	@cd frontend && npm install --legacy-peer-deps && npx vite build && cd ..
	@echo -e "${GREEN}Frontend application for Docker built successfully!${NC}"

build-api-gateway-for-docker: ## Build api-gateway for Docker stage
	@echo -e "${BLUE}Building api-gateway service for Docker...${NC}"
	@make -C backend build-service SERVICE=api-gateway
	@echo -e "${GREEN}api-gateway service for Docker built successfully!${NC}"

# Combined Commands
install: ## Install backend dependencies and required Go tools
	@echo -e "${BLUE}Installing backend Go tools...${NC}"
	@make -C backend install-tools
	@echo -e "${GREEN}Backend Go tools installation initiated.${NC}"
	@echo -e "${YELLOW}Note: This installs tools like goose, golangci-lint, buf, and air using 'go install'. Ensure your GOPATH/bin is in your PATH.${NC}"

build: ## Build backend and frontend for production (without Docker)
	@echo -e "${BLUE}Building backend services using local Go environment...${NC}"
	@make -C backend build
	@echo -e "${GREEN}Backend components built successfully!${NC}"
	@echo -e "${BLUE}Building frontend application...${NC}"
	@cd frontend && npm install --legacy-peer-deps && npx vite build && cd ..
	@echo -e "${GREEN}Frontend application built successfully!${NC}"

test: test-backend ## Run all backend tests
	@echo -e "${GREEN}Backend tests completed!${NC}"

clean: ## Clean build artifacts
	@echo -e "${BLUE}Cleaning build artifacts...${NC}"
	@# No frontend artifacts to clean from root anymore
	@make -C $(BACKEND_DIR) clean
	@echo -e "${GREEN}Build artifacts cleaned successfully!${NC}"

# Cloud Deployment Testing
cloud-test-build: build ## Test full build process (backend & frontend) for cloud deployment readiness
	@echo -e "${BLUE}Testing full build process for cloud deployment readiness...${NC}"
	@echo -e "${GREEN}Local build process completed successfully!${NC}"
	@echo -e "${YELLOW}Note: Local build process completed. Docker images can now be built using the Dockerfiles which leverage this build system.${NC}"
	# @echo -e "${YELLOW}Auth service image: wc-auth-svc:latest${NC}" # Example, if you were building a specific image
	# @docker images | grep -E 'wc-auth-svc' # Commented out as 'build' no longer creates Docker images directly
