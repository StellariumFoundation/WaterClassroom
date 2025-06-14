# frontend/Makefile

.PHONY: all build install-deps clean test

# Determine whether bun is installed; empty if missing
BUN := $(shell command -v bun 2>/dev/null)

all: build

install-deps:
	@echo "Installing frontend dependencies..."
	@if [ -z "$(BUN)" ]; then \
	  echo "▶ bun not found – installing via npm"; \
	  npm install -g bun@1; \
	else \
	  echo "▶ Using existing bun: $(BUN)"; \
	fi
	@bun install --legacy-peer-deps

build: install-deps
	@echo "Building frontend application..."
	@bun run build

clean:
	@echo "Cleaning frontend build artifacts..."
	rm -rf build .svelte-kit

# Run Vitest unit tests and Playwright e2e tests

test: install-deps
	@echo "Running frontend tests..."
	@echo "▶ Ensuring Playwright browsers are installed";
	@npx playwright install --with-deps
	@npm run test
