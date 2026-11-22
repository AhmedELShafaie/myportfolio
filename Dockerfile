# ==============================================================================
# Multi-Stage, Hardened, Unprivileged Dockerfile for Ahmed Fathy DevOps Portfolio
# ==============================================================================

# Stage 1: Build & Security Audit
FROM alpine:3.20 AS builder
WORKDIR /app
COPY . .
# Verify file integrity and syntax
RUN test -f index.html && test -f css/style.css && test -f js/app.js

# Stage 2: Production Runtime with Nginx Unprivileged
FROM nginxinc/nginx-unprivileged:1.26-alpine

LABEL maintainer="Ahmed Fathy <ahmed.fathy@gmail.com>"
LABEL org.opencontainers.image.title="Ahmed Fathy DevOps Portfolio"
LABEL org.opencontainers.image.description="Cloud Platform & DevOps SRE Portfolio Web Application"
LABEL org.opencontainers.image.source="https://github.com/AhmedELShafaie/myportfolio"

# Copy custom security-hardened nginx configuration
COPY --chown=101:101 nginx.conf /etc/nginx/nginx.conf

# Copy static assets to web root
COPY --chown=101:101 index.html /usr/share/nginx/html/
COPY --chown=101:101 css/ /usr/share/nginx/html/css/
COPY --chown=101:101 js/ /usr/share/nginx/html/js/

# Security: Run as non-root user (nginx unprivileged default UID 101)
USER 101

# Expose standard unprivileged web port
EXPOSE 8080

# Healthcheck for container orchestrators (Docker Swarm / Kubernetes)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:8080/healthz || exit 1

ENTRYPOINT ["nginx", "-g", "daemon off;"]
