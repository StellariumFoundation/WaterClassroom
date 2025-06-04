SERVICES := api-gateway auth-svc curriculum-svc payment-svc
BIN_DIR := $(CURDIR)/bin
nl := $(shell printf '\n')

.PHONY: create_bin_dir
create_bin_dir:
	@echo "Creating binary directory $(BIN_DIR)..."
	@mkdir -p $(BIN_DIR)

.PHONY: build
build: create_bin_dir
	@echo "Building all services..."
	@$(foreach service,$(SERVICES), \
		echo "Building $(service)..."; \
		(cd ./$(service) && \
		if [ -f ./cmd/main.go ]; then \
			go build -o $(BIN_DIR)/$(service) ./cmd/main.go; \
		else \
			go build -o $(BIN_DIR)/$(service) ./main.go; \
		fi ); \
	)
	@echo "All services built successfully."

# This is where tabs are critical
define SERVICE_BUILD_RECIPE
	@echo "Building $(1)..."
	(cd ./$(1) && \
	if [ -f ./cmd/main.go ]; then \
	    go build -o $(BIN_DIR)/$(1) ./cmd/main.go; \
	else \
	    go build -o $(BIN_DIR)/$(1) ./main.go; \
	fi)
	@echo "$(1) built successfully."
endef

# Individual service build targets
$(foreach service,$(SERVICES), \
    $(eval .PHONY: build-$(service)) \
    $(eval build-$(service): create_bin_dir) \
    $(eval build-$(service): ; $(call SERVICE_BUILD_RECIPE,$(service))) \
)

.PHONY: clean
clean:
	@echo "Cleaning build artifacts..."
	@rm -rf $(BIN_DIR)
	@echo "Build artifacts cleaned."
