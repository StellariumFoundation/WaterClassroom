.PHONY: test build

test:
	@echo "Running backend tests..."
	$(MAKE) -C frontend test
	@echo "Running frontend tests..."
	$(MAKE) -C backend test

build:
	@echo "Building backend..."
	$(MAKE) -C backend build
	@echo "Building frontend..."
	$(MAKE) -C frontend build
