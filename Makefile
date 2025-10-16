.PHONY: help
help:
	@echo "Knot - Docker Commands"
	@echo ""
	@echo "  up                     - Build and start all services (backend, frontend, database)"
	@echo "  up-detached           - Build and start all services in background"
	@echo "  down                  - Stop all services"
	@echo "  down-volumes          - Stop all services and remove volumes (deletes data)"
	@echo "  build                 - Build all Docker images"
	@echo ""

.DEFAULT_GOAL := help

.PHONY: up
up:
	docker compose up --build

.PHONY: up-detached
up-detached:
	docker compose up --build -d

.PHONY: down
down:
	docker compose down

.PHONY: down-volumes
down-volumes:
	docker compose down -v

.PHONY: build
build:
	docker compose build
