# frontend/Makefile

.PHONY: all build install-deps test

all: build

install-deps:
	@echo "Installing frontend dependencies..."
	npm install --legacy-peer-deps
	npm install @sveltejs/kit

build: install-deps
	@echo "Building frontend application..."
	npx vite build

clean:
	@echo "Cleaning frontend build artifacts..."
	rm -rf build
	rm -rf .svelte-kit

test:
	@echo "Running frontend tests..."
	npm test
