.PHONY: test build

test:
	@echo "Running backend tests..."
	$(MAKE) -C backend test
	@echo "Running frontend tests..."
	$(MAKE) -C frontend test

build:
	@echo "Building backend..."
	$(MAKE) -C backend build
	@echo "Building frontend..."
	$(MAKE) -C frontend build
