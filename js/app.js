/**
 * Main Application Script: Interactivity, Filter Tabs, Pipeline Stepper, Contact Form
 * Author: Ahmed Fathy
 */

document.addEventListener('DOMContentLoaded', () => {
    // 0. Theme Controller: Light and Dark Mode with LocalStorage & OS Preference
    const themeToggleBtn = document.getElementById('themeToggleBtn');

    function getSavedTheme() {
        try {
            return localStorage.getItem('theme');
        } catch (err) {
            return null;
        }
    }

    function setSavedTheme(theme) {
        try {
            if (theme) {
                localStorage.setItem('theme', theme);
            } else {
                localStorage.removeItem('theme');
            }
        } catch (err) {
            console.warn('LocalStorage unavailable:', err);
        }
    }

    function applyTheme(theme, save = true) {
        document.documentElement.setAttribute('data-theme', theme);
        if (save) {
            setSavedTheme(theme);
        }
        if (themeToggleBtn) {
            const isDark = theme === 'dark';
            themeToggleBtn.setAttribute('aria-checked', isDark ? 'true' : 'false');
            themeToggleBtn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
            themeToggleBtn.setAttribute('title', isDark ? 'Switch to light mode' : 'Switch to dark mode');
        }
        window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
    }

    function toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
        const next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next, true);
    }

    // Public JavaScript API (documented in README.md)
    window.setPortfolioTheme = function(theme) {
        if (theme === 'light' || theme === 'dark') {
            applyTheme(theme, true);
        }
    };

    window.togglePortfolioTheme = function() {
        toggleTheme();
    };

    window.resetPortfolioThemeToAuto = function() {
        setSavedTheme(null);
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(prefersDark ? 'dark' : 'light', false);
    };

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }

    // Auto-update theme if system preference changes and user hasn't explicitly set a preference
    if (window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleMediaChange = (e) => {
            const saved = getSavedTheme();
            if (!saved) {
                applyTheme(e.matches ? 'dark' : 'light', false);
            }
        };
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handleMediaChange);
        } else if (mediaQuery.addListener) {
            mediaQuery.addListener(handleMediaChange);
        }
    }

    // Sync button state on initial load
    const activeTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    applyTheme(activeTheme, false);

    // 1. Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            const open = navMenu.classList.toggle('active');
            mobileMenuBtn.setAttribute('aria-expanded', String(open));
        });

        // Close mobile menu on clicking any navigation link
        navMenu.querySelectorAll('.nav-link, .nav-btn').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // 2. Toolchain / Skills Filter Tabs
    const toolTabs = document.querySelectorAll('.toolchain-tab');
    const toolCards = document.querySelectorAll('.tool-card');

    toolTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            toolTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const filter = tab.getAttribute('data-filter');

            toolCards.forEach(card => {
                if (filter === 'all') {
                    card.style.display = 'block';
                } else {
                    const categories = card.getAttribute('data-category').split(' ');
                    if (categories.includes(filter)) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
        });
    });

    // 3. Interactive Pipeline Stepper & Architecture Content
    const pipelineSteps = [
        {
            step: 1,
            title: "Phase 01: Code Commit & Pre-Commit Linting",
            desc: "Developer pushes code or IaC pull request. Automated hooks check formatting, syntax, and secret leaks before code ever reaches upstream branches.",
            items: [
                "<strong>TFLint & Checkov:</strong> Static analysis for Terraform configurations ensuring cloud best practices.",
                "<strong>Gitleaks:</strong> Pre-commit scans preventing private keys, tokens, or AWS credentials from leaking.",
                "<strong>Conventional Commits:</strong> Automated semantic versioning and changelog generator."
            ],
            codeHeader: "ci/pre-commit-config.yaml",
            code: `repos:
  - repo: https://github.com/antonbabenko/pre-commit-terraform
    rev: v1.88.0
    hooks:
      - id: terraform_fmt
      - id: terraform_tflint
      - id: terraform_checkov
  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.18.2
    hooks:
      - id: gitleaks`
        },
        {
            step: 2,
            title: "Phase 02: DevSecOps & Automated Security Gates",
            desc: "Security validation happens automatically in pull request CI runners. Any CRITICAL CVE or policy violation stops the merge.",
            items: [
                "<strong>Trivy Vulnerability Scanner:</strong> Scans filesystem, OS packages, and dependencies for CVEs.",
                "<strong>Open Policy Agent (OPA) / Conftest:</strong> Enforces compliance policies (e.g. S3 encryption, restricted CIDRs).",
                "<strong>SonarQube Quality Gate:</strong> Code smell, vulnerability, and test coverage thresholds."
            ],
            codeHeader: ".github/workflows/security-gate.yml",
            code: `- name: Run Trivy Vulnerability Scanner
  uses: aquasecurity/trivy-action@master
  with:
    scan-type: 'fs'
    severity: 'CRITICAL,HIGH'
    exit-code: '1'
    ignore-unfixed: true`
        },
        {
            step: 3,
            title: "Phase 03: Multi-Stage Build & Cryptographic Signing",
            desc: "Container images are built using non-root distroless images with BuildKit cache mounts and cryptographically signed with Cosign.",
            items: [
                "<strong>Docker BuildKit:</strong> Ultra-fast parallel multi-stage compilation on unprivileged Alpine/Distroless bases.",
                "<strong>Cosign Keyless Signing:</strong> Cryptographic signatures linked to GitHub OIDC token identity.",
                "<strong>Syft SBOM:</strong> Generates Software Bill of Materials (SPDX/CycloneDX) for audit provenance."
            ],
            codeHeader: "docker/sign-artifact.sh",
            code: `# Build & push container image
docker buildx build --push -t ghcr.io/org/api:v2.4.0 .

# Keyless Cosign Signing with GitHub OIDC
cosign sign --yes ghcr.io/org/api:v2.4.0

# Generate & attach SBOM
syft ghcr.io/org/api:v2.4.0 -o spdx-json=sbom.spdx.json
cosign attach sbom --sbom sbom.spdx.json ghcr.io/org/api:v2.4.0`
        },
        {
            step: 4,
            title: "Phase 04: GitOps Reconciliation with ArgoCD",
            desc: "Infrastructure and application manifests in Git reflect the true state. ArgoCD continuously syncs desired state to Kubernetes clusters.",
            items: [
                "<strong>Declarative Sync:</strong> ArgoCD Controller auto-detects diffs and applies manifests with sync waves.",
                "<strong>Argo Rollouts:</strong> Automated Canary deployment routing 10% -> 25% -> 50% -> 100% based on Prometheus metrics.",
                "<strong>Automated Rollback:</strong> Instantly rolls back to previous stable ReplicaSet if HTTP error rate exceeds 0.5%."
            ],
            codeHeader: "gitops/argocd-application.yaml",
            code: `apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: payment-engine
  namespace: argocd
spec:
  project: default
  source:
    repoURL: 'https://github.com/org/k8s-manifests.git'
    targetRevision: HEAD
    path: apps/payment-engine/overlays/production
  destination:
    server: 'https://kubernetes.default.svc'
    namespace: production
  syncPolicy:
    automated:
      prune: true
      selfHeal: true`
        },
        {
            step: 5,
            title: "Phase 05: Observability, SRE Golden Signals & Alerting",
            desc: "Prometheus, Grafana, OpenTelemetry, and Alertmanager continuously track service health, SLOs/SLIs, and system performance.",
            items: [
                "<strong>Golden Signals:</strong> Latency, Traffic (RPS), Errors (5xx), and Saturation (CPU/RAM).",
                "<strong>Alertmanager Pager Routing:</strong> Deduplicated alerts sent directly to on-call Slack channels and PagerDuty.",
                "<strong>Karpenter Auto-Balancing:</strong> Dynamically provisions right-sized EC2 spot and on-demand instances based on pending pod requests."
            ],
            codeHeader: "monitoring/service-monitor.yaml",
            code: `apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: api-monitor
  labels:
    release: prometheus-stack
spec:
  selector:
    matchLabels:
      app.kubernetes.io/name: payment-engine
  endpoints:
  - port: metrics
    interval: 15s
    path: /actuator/prometheus`
        }
    ];

    const stepNodes = document.querySelectorAll('.step-node');
    const pipelineDetailBox = document.getElementById('pipelineDetailBox');

    function renderPipelineStep(index) {
        const data = pipelineSteps[index];
        if (!data || !pipelineDetailBox) return;

        const itemsHtml = data.items.map(item => `
            <li><i class="fas fa-check-circle text-accent"></i> <span>${item}</span></li>
        `).join('');

        pipelineDetailBox.innerHTML = `
            <div class="pipe-box-grid">
                <div class="pipe-info">
                    <h3 class="pipe-info-title">${data.title}</h3>
                    <p class="pipe-info-desc">${data.desc}</p>
                    <ul class="pipe-items-list">
                        ${itemsHtml}
                    </ul>
                </div>
                <div class="pipe-code-wrapper">
                    <div class="pipe-code-header font-mono">
                        <span><i class="fas fa-file-code text-accent"></i> ${data.codeHeader}</span>
                        <span>YAML / BASH</span>
                    </div>
                    <pre class="font-mono"><code>${data.code}</code></pre>
                </div>
            </div>
        `;
    }

    stepNodes.forEach((node, idx) => {
        node.addEventListener('click', () => {
            stepNodes.forEach(n => n.classList.remove('active'));
            node.classList.add('active');
            renderPipelineStep(idx);
        });
    });

    // Initialize first step
    renderPipelineStep(0);

    // 4. Contact Form Handling
    const contactForm = document.getElementById('contactForm');
    const formFeedback = document.getElementById('formFeedback');

    if (contactForm && formFeedback) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('contactName').value;
            const email = document.getElementById('contactEmail').value;
            const subject = document.getElementById('contactSubject').value;
            const message = document.getElementById('contactMessage').value;

            // Prepare mailto link fallback
            const mailtoUrl = `mailto:ahmed.fathy@gmail.com?subject=${encodeURIComponent(subject + " - " + name)}&body=${encodeURIComponent("Sender: " + name + " (" + email + ")\n\n" + message)}`;

            formFeedback.innerHTML = `
                <div style="color: var(--success); margin-top: 0.5rem;">
                    <i class="fas fa-check-circle"></i> Message queued successfully! Opening your email client to transmit to ahmed.fathy@gmail.com...
                </div>
            `;

            setTimeout(() => {
                window.location.href = mailtoUrl;
            }, 1000);
        });
    }
});
