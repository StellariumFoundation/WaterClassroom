# List all subdirectories except 'services/'
SUBDIRS := $(filter-out services/, $(wildcard */))
# Remove trailing slashes to get project names
PROJECTS := $(patsubst %/,%,$(SUBDIRS))
# Define binary paths in the 'services' folder
BINARIES := $(addprefix services/,$(PROJECTS))

# Build all binaries
build: $(BINARIES)

# Ensure the 'services' folder exists
services:
    mkdir -p services

# Pattern rule to build each binary
services/% : % | services
    go build -o $@ ./$<

# Run all binaries in the background
run: $(BINARIES)
    for bin in $(BINARIES); do $$bin & done

.PHONY: build run
