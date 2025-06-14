# Makefile for the Water Classroom backend

BINARY_NAME=water-classroom-backend

.PHONY: build test clean

build:
	@echo "Building Go application..."
	@go build -o $(BINARY_NAME) main.go

test:
	@echo "Running tests..."
	@go test ./...

clean:
	@echo "Cleaning up..."
	@rm -f $(BINARY_NAME)
