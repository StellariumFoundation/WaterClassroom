# frontend/Makefile

.PHONY: all build install-deps test

all: build

install-deps:
	@echo "Installing frontend dependencies..."
	bun install --legacy-peer-deps

build: install-deps
	@echo "Building frontend application..."
	bun run build

clean:
	@echo "Cleaning frontend build artifacts..."
	rm -rf build
	rm -rf .svelte-kit

test:
	@echo "Running frontend tests..."
	npm test
