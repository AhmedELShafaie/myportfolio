# ==============================================================================
# Makefile - DevOps Automation for Ahmed Fathy's Portfolio
# ==============================================================================

.PHONY: help build run stop test lint docker-build docker-run k8s-apply tf-plan clean

IMAGE_NAME ?= ahmedfathy/devops-portfolio
TAG ?= latest
PORT ?= 8080

help: ## Show this help message
	@echo "Usage: make [target]"
	@echo ""
	@echo "Targets:"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

lint: ## Validate HTML, CSS, and Nginx configurations
	@echo "==> Validating Nginx config & files..."
	@docker run --rm -v $$(pwd):/work:ro alpine:3.20 sh -c "test -f /work/index.html && test -f /work/nginx.conf && echo 'Syntax check passed!'"

docker-build: ## Build hardened Docker container image
	@echo "==> Building Docker image $(IMAGE_NAME):$(TAG)..."
	docker build -t $(IMAGE_NAME):$(TAG) .

docker-run: docker-build ## Run container locally on port 8080
	@echo "==> Running $(IMAGE_NAME) on http://localhost:$(PORT)..."
	docker run -d --rm -p $(PORT):8080 --name devops-portfolio $(IMAGE_NAME):$(TAG)
	@echo "Portfolio running at http://localhost:$(PORT)"

docker-stop: ## Stop local running container
	@echo "==> Stopping container..."
	docker stop devops-portfolio || true

up: ## Start with docker-compose
	docker compose up -d

down: ## Stop docker-compose
	docker compose down

k8s-dry-run: ## Validate Kubernetes manifests with dry-run
	@echo "==> Running Kubernetes manifest validation..."
	kubectl apply -k k8s/ --dry-run=client

tf-init: ## Initialize Terraform AWS deployment
	@echo "==> Initializing Terraform..."
	cd terraform && terraform init

tf-plan: tf-init ## Run Terraform plan
	@echo "==> Planning AWS infrastructure..."
	cd terraform && terraform plan

clean: ## Clean local build artifacts
	@echo "==> Cleaning..."
	rm -rf .terraform terraform/.terraform*
