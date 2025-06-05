# Find all immediate subdirectories containing .go files
GO_FILES := $(wildcard */*.go)
GO_DIRS := $(sort $(dir $(GO_FILES)))
SUBDIRS := $(filter-out services/, $(GO_DIRS))

# Remove trailing slashes to get project names
PROJECTS := $(patsubst %/,%,$(SUBDIRS))
# Define binary paths in the 'services' folder
BINARIES := $(addprefix services/,$(PROJECTS))

# Build all binaries
build: $(BINARIES)

# Ensure the 'services' folder exists
services:
    mkdir -p services

# Pattern rule to build each binary from its .go files
services/% : $(wildcard % anchoring) | services
    for dir in $(SUBDIRS); do \
        ( go build -o $@ ./$* ) & \
    done; \
    wait

# Run all binaries in the background
run: $(BINARIES)
    for bin in $(BINARIES); do $$bin & done

.PHONY: build run
