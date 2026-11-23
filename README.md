# 🚀 Ahmed Fathy — Senior DevOps & Cloud Platform Engineer Portfolio

A production-grade, highly responsive, cyber-cloud themed portfolio website tailored specifically for a **DevOps, SRE, and Cloud Platform Engineer**. 

Features an authentic dark-mode and crisp light-mode UI with instant theme switching, system OS auto-detection and persistence, live interactive DevOps CLI terminal simulator (`kubectl`, `terraform`, `vault`, `curl`, `theme`), end-to-end CI/CD and GitOps interactive architecture visualizer, verified credentials, and real-world production case studies.

---

## 🛠️ Tech Stack & Features

- **Frontend:** Semantic HTML5, Modern CSS3 with CSS variables (Dark/Light themes) & Glassmorphism, Vanilla JS ES6+.
- **Light & Dark Theme System:**
  - Modern toggle switch in navigation header with smooth sliding thumb and animated sun/moon indicators.
  - CLI integration: Toggle or set themes directly inside the terminal (`theme light`, `theme dark`, `theme toggle`, `theme auto`).
  - `localStorage` theme state persistence across browser sessions with safe fallback handling.
  - Automatic `prefers-color-scheme` OS detection with real-time system change listening.
  - Zero-FOUC (Flash of Unstyled Content) synchronous `<head>` bootstrapper.
  - Accessible design: `role="switch"`, `aria-checked`, and `@media (prefers-reduced-motion)`.
  - JavaScript Public API:
    - `window.setPortfolioTheme('light' | 'dark')` — Programmatically set the theme.
    - `window.togglePortfolioTheme()` — Toggle between light and dark modes.
    - `window.resetPortfolioThemeToAuto()` — Remove local override and sync with OS theme.
    - `themeChanged` window event dispatched on theme updates.
- **Interactive Terminal:** Custom in-browser CLI terminal with tab autocomplete, command history (Arrow Up/Down), and simulation for:
  - `kubectl get nodes` / `kubectl get pods -A` / `kubectl cluster-info`
  - `terraform plan` / `terraform apply`
  - `vault status` (HashiCorp Vault cluster status)
  - `curl /metrics` (Prometheus exposition format)
  - `cat resume.txt` & `whoami`
  - `theme [light|dark|toggle|auto]` (dynamic UI theme controller)
- **Interactive Pipeline Visualizer:** 5-phase interactive CI/CD & GitOps architecture walk-through (Linting -> Security Gates -> Multi-Stage Build & Cosign -> ArgoCD Sync -> Telemetry).
- **Containerization:** Multi-stage unprivileged `nginxinc/nginx-unprivileged:1.26-alpine` container running on non-root UID `101`.
- **Infrastructure as Code (IaC):**
  - **Docker & Compose:** `Dockerfile` and `docker-compose.yml` with healthchecks.
  - **Kubernetes:** Production-ready `k8s/` manifests (`Deployment`, `Service`, `Ingress`, `Kustomization`).
  - **Terraform:** Complete AWS static hosting architecture (`S3` + `CloudFront OAC` + `Bucket Policy`).
  - **CI/CD:** GitHub Actions pipeline (`.github/workflows/ci-cd.yml`) with Trivy security scans.

---

## 📂 Repository Structure

```
myportfolio/
├── index.html              # Main responsive portfolio web application
├── css/
│   └── style.css           # Cyber-ops design system, responsiveness, glassmorphism
├── js/
│   ├── app.js              # Pipeline stepper, skills filter, contact form handling
│   └── terminal.js         # Interactive CLI terminal simulator
├── Dockerfile              # Production-grade hardened multi-stage Nginx container
├── nginx.conf              # Security-hardened Nginx configuration (CSP, gzip, /healthz)
├── docker-compose.yml      # Local dev environment
├── Makefile                # Automation targets (build, lint, test, run)
├── .github/
│   └── workflows/
│       └── ci-cd.yml       # Production GitHub Actions workflow (lint, Trivy, build)
├── k8s/
│   ├── deployment.yaml     # Kubernetes Deployment with securityContext & probes
│   ├── service.yaml        # K8s Service (ClusterIP)
│   ├── ingress.yaml        # Ingress with TLS & cert-manager annotations
│   └── kustomization.yaml  # Kustomize manifest
├── terraform/
│   ├── main.tf             # AWS S3 + CloudFront OAC + IAM bucket policy
│   ├── variables.tf        # AWS variables
│   └── outputs.tf          # CloudFront domain output
└── README.md               # Portfolio documentation
```

---

## ⚡ Quick Start & Local Preview

### Option 1: Open Directly in Any Browser
You can open `index.html` directly in your browser:
```powershell
Start-Process "i:\Hashicorp\myportfolio\index.html"
```

### Option 2: Run with Docker Compose
```bash
docker compose up -d
# Open http://localhost:8080 in your browser
```

### Option 3: Using the Makefile
```bash
make docker-run
# Open http://localhost:8080 in your browser
```

---

## ☸️ Deploying to Kubernetes

Deploy using Kustomize:
```bash
kubectl create namespace portfolio
kubectl apply -k k8s/
```

Check rollout status:
```bash
kubectl rollout status deployment/devops-portfolio -n portfolio
```

---

## ☁️ Deploying to AWS via Terraform

Provision the S3 bucket with CloudFront CDN distribution:
```bash
cd terraform
terraform init
terraform plan
terraform apply --auto-approve
```

Sync web files to S3:
```bash
aws s3 sync ../ s3://$(terraform output -raw s3_bucket_id) --exclude ".*" --exclude "terraform/*" --exclude "k8s/*"
```

---

## 👤 Author

**Ahmed Fathy**  
- Role: Senior DevOps & Cloud Platform Engineer  
- Email: [ahmed.fathy@gmail.com](mailto:ahmed.fathy@gmail.com)  
- Focus: Kubernetes, Terraform, HashiCorp Vault, AWS, GitOps, SRE
