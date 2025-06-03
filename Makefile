# Water Classroom - Root Makefile
# This Makefile provides commands for building, testing, and running both frontend and backend components
# Version: 1.0.0
# Date: May 30, 2025

# Make all targets PHONY to ensure they always run
.PHONY: help build-backend-dev-images run-backend-dev stop-backend-dev logs-backend-dev test-backend build-auth-svc-prod-image \
        install build test clean cloud-test-build build-frontend clean-frontend test-frontend

# Variables
SHELL := /bin/bash
BACKEND_DIR := backend
FRONTEND_DIR := frontend
FRONTEND_BUILD_DIR := $(FRONTEND_DIR)/dist
FRONTEND_NODE_MODULES := $(FRONTEND_DIR)/node_modules
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

# Frontend Commands
build-frontend: ## Build frontend application
	@echo -e "${BLUE}Installing frontend dependencies...${NC}"
	@npm install --prefix $(FRONTEND_DIR)
	@echo -e "${BLUE}Building frontend application...${NC}"
	@cd $(FRONTEND_DIR) && npm run build
	@echo -e "${GREEN}Frontend application built successfully! Output: $(FRONTEND_BUILD_DIR)${NC}"

clean-frontend: ## Clean frontend build artifacts and dependencies
	@echo -e "${BLUE}Cleaning frontend build artifacts and dependencies...${NC}"
	@rm -rf $(FRONTEND_BUILD_DIR)
	@rm -rf $(FRONTEND_NODE_MODULES)
	@echo -e "${GREEN}Frontend build artifacts and dependencies cleaned successfully!${NC}"

test-frontend: ## Run frontend checks and tests
	@echo -e "${BLUE}Installing frontend dependencies for testing...${NC}"
	@npm install --prefix $(FRONTEND_DIR)
	@echo -e "${BLUE}Running frontend checks and tests...${NC}"
	@cd $(FRONTEND_DIR) && npm run check
	@echo -e "${GREEN}Frontend checks and tests completed.${NC}"

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

# Combined Commands
install: ## Install all backend dependencies (no-op for root, handled by backend Makefile)
	@echo -e "${GREEN}Backend dependencies are managed by the backend Makefile.${NC}"
	@echo -e "${YELLOW}Run 'make -C backend install' if you need to manage backend dependencies explicitly.${NC}"

build: build-auth-svc-prod-image build-frontend ## Build backend and frontend for production
	@echo -e "${GREEN}Backend and frontend components built successfully!${NC}"

test: test-backend test-frontend ## Run all backend and frontend tests
	@echo -e "${GREEN}Backend and frontend tests completed!${NC}"

clean: clean-frontend ## Clean backend and frontend build artifacts
	@echo -e "${BLUE}Cleaning all build artifacts...${NC}"
	@make -C $(BACKEND_DIR) clean
	@echo -e "${GREEN}All build artifacts cleaned successfully!${NC}"

# Cloud Deployment Testing
cloud-test-build: build ## Test full backend and frontend build process for cloud deployment
	@echo -e "${BLUE}Testing full backend build process for cloud deployment...${NC}"
	@echo -e "${GREEN}Backend and frontend build process completed successfully!${NC}"
	@echo -e "${YELLOW}Note: This build has generated Docker images and frontend assets that can be deployed.${NC}"
	@echo -e "${YELLOW}Auth service image: wc-auth-svc:latest${NC}"
	@echo -e "${YELLOW}Frontend assets in: $(FRONTEND_BUILD_DIR)${NC}"
	@docker images | grep -E 'wc-auth-svc'
