/**
 * Interactive DevOps Terminal Simulator
 * Author: Ahmed Fathy
 */

document.addEventListener('DOMContentLoaded', () => {
    const terminalInput = document.getElementById('terminalInput');
    const terminalOutput = document.getElementById('terminalOutput');
    const termClearBtn = document.getElementById('termClearBtn');
    const quickCmdButtons = document.querySelectorAll('.quick-cmd');

    if (!terminalInput || !terminalOutput) return;

    let commandHistory = [];
    let historyIndex = -1;

    // Supported Commands & Handlers
    const commands = {
        help: () => {
            return `
Available commands:
  <span class="text-accent">whoami</span>              - Display engineer profile & background
  <span class="text-accent">skills</span>              - List core toolchain and operational proficiencies
  <span class="text-accent">projects</span>            - Overview of featured production architectures
  <span class="text-accent">kubectl [args]</span>       - Simulate Kubernetes cluster CLI (e.g., 'kubectl get pods', 'kubectl get nodes')
  <span class="text-accent">terraform [plan|apply]</span>- Simulate Terraform IaC workflow
  <span class="text-accent">vault status</span>         - Query HashiCorp Vault security cluster state
  <span class="text-accent">curl [endpoint]</span>      - Query API endpoints (e.g. 'curl /metrics', 'curl /health')
  <span class="text-accent">cat resume.txt</span>       - View plaintext curriculum vitae
  <span class="text-accent">uptime</span>              - Display platform uptime and cluster load average
  <span class="text-accent">contact</span>             - Reach out to Ahmed Fathy
  <span class="text-accent">clear</span>               - Clear the terminal screen
`;
        },

        whoami: () => {
            return `
<span class="text-white">Ahmed Fathy</span> | Senior DevOps & Cloud Platform Engineer
Location: Available for Global Remote & Relocation
Focus: Kubernetes Architecture, HashiCorp Suite (Terraform/Vault), GitOps & SRE
Email: ahmed.fathy@gmail.com
Status: <span class="text-success">Available for high-impact Platform, SRE & Senior DevOps roles</span>
`;
        },

        skills: () => {
            return `
<span class="text-purple">=== CORE COMPETENCIES & TOOLCHAIN ===</span>

  • <strong class="text-white">IaC & Config:</strong>      Terraform, Terragrunt, OpenTofu, Ansible, Packer
  • <strong class="text-white">Containers & Orch:</strong>  Kubernetes (EKS), Docker, Helm v3, ArgoCD, Istio, Cilium
  • <strong class="text-white">Cloud Platforms:</strong>    AWS (VPC, IAM, EKS, RDS, S3, CloudFront), Hybrid Cloud
  • <strong class="text-white">DevSecOps:</strong>          HashiCorp Vault, Trivy, Cosign, SonarQube, OPA/Conftest
  • <strong class="text-white">CI/CD:</strong>               GitHub Actions, GitLab CI, Argo Rollouts
  • <strong class="text-white">Observability:</strong>       Prometheus, Grafana, OpenTelemetry, Loki, Alertmanager
  • <strong class="text-white">Languages:</strong>           Bash, Python, Go, HCL, YAML
`;
        },

        projects: () => {
            return `
<span class="text-accent">=== PRODUCTION CASE STUDIES ===</span>

  [1] <strong class="text-white">Multi-Cluster GitOps Platform</strong> (AWS EKS + ArgoCD + Istio)
      Canary deployments with automated rollbacks, zero downtime, Karpenter scaling.

  [2] <strong class="text-accent">Zero-Trust Secrets & PKI Hub</strong> (HashiCorp Vault + AWS IRSA)
      Dynamic DB credentials, auto-rotating TLS certs, 100% elimination of static secrets.

  [3] <strong class="text-purple">Enterprise IaC & Drift Guard</strong> (Terraform + OPA + GitHub Actions)
      Reusable modular landing zone, automated drift detection, policy enforcement.

  [4] <strong class="text-success">DevSecOps & SLSA Level 3 Supply Chain</strong> (Trivy + Cosign + Kyverno)
      Pre-merge CVE gating, cryptographic image signing, automated SBOM extraction.
`;
        },

        kubectl: (args) => {
            const sub = args.join(' ').trim();
            if (sub === 'get nodes' || sub === 'get node') {
                return `
NAME                                          STATUS   ROLES           AGE   VERSION
ip-10-0-1-12.ec2.internal (us-east-1a)       Ready    control-plane   84d   v1.30.2
ip-10-0-2-34.ec2.internal (us-east-1b)       Ready    worker          84d   v1.30.2
ip-10-0-3-56.ec2.internal (us-east-1c)       Ready    worker          84d   v1.30.2
ip-10-0-4-78.ec2.internal (karpenter-spot)   Ready    worker,spot     12h   v1.30.2
`;
            } else if (sub.startsWith('get pods') || sub === 'get po') {
                return `
NAMESPACE      NAME                               READY   STATUS    RESTARTS   AGE
argocd         argocd-server-7945d74b85-x2n8k     1/1     Running   0          42d
cert-manager   cert-manager-5878848d6b-j49m9      1/1     Running   0          56d
ingress-nginx  ingress-nginx-controller-q8f2l     1/1     Running   0          84d
monitoring     prometheus-k8s-0                   2/2     Running   0          30d
monitoring     grafana-67df768f9b-w7p21           1/1     Running   0          30d
vault          vault-0                            1/1     Running   0          90d
production     api-gateway-v2-canary-86f7b49f8    1/1     Running   0          18m
production     api-gateway-v2-stable-7bc6d58f4    1/1     Running   0          14d
`;
            } else if (sub === 'cluster-info') {
                return `
<span class="text-success">Kubernetes control plane</span> is running at https://eks.us-east-1.amazonaws.com
<span class="text-success">CoreDNS</span> is running at https://eks.us-east-1.amazonaws.com/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy
`;
            } else {
                return `kubectl: try 'kubectl get nodes', 'kubectl get pods -A', or 'kubectl cluster-info'`;
            }
        },

        terraform: (args) => {
            const sub = args[0] || '';
            if (sub === 'plan') {
                return `
<span class="text-slate-400">Terraform used the selected providers to generate the following execution plan:</span>

<span class="text-success">+ module.eks_cluster.aws_eks_node_group.spot_workers</span>
<span class="text-success">+ module.vault.aws_kms_key.vault_unseal</span>
<span class="text-success">+ module.networking.aws_vpc.production</span>
<span class="text-success">+ module.argocd.helm_release.argo_rollouts</span>

<span class="text-success">Plan: 4 to add, 0 to change, 0 to destroy.</span>

─────────────────────────────────────────────────────────────────────────────
Changes are saved to binary execution plan: /tmp/tfplan.out
`;
            } else if (sub === 'apply') {
                return `
<span class="text-slate-400">module.networking.aws_vpc.production: Creating... [id=vpc-084a92c019]</span>
<span class="text-slate-400">module.eks_cluster.aws_eks_node_group.spot_workers: Creation complete after 42s</span>
<span class="text-success">Apply complete! Resources: 4 added, 0 changed, 0 destroyed.</span>
<span class="text-accent">Outputs:</span>
cluster_endpoint = "https://B12489C.gr7.us-east-1.eks.amazonaws.com"
vault_active_address = "https://vault.internal.corp:8200"
`;
            } else {
                return `terraform: try 'terraform plan' or 'terraform apply'`;
            }
        },

        vault: (args) => {
            return `
Key                      Value
---                      -----
Recovery Seal Type       shamir
Initialized              true
Sealed                   <span class="text-success">false</span>
Total Recovery Shares    5
Threshold                3
Version                  1.16.2
Build Date               2026-04-12T10:14:02Z
Storage Type             raft
Cluster Name             vault-prod-cluster-us-east-1
HA Enabled               <span class="text-success">true</span>
HA Cluster               https://vault-0.vault-internal:8201
HA Mode                  <span class="text-accent">active</span>
`;
        },

        curl: (args) => {
            const target = args[0] || '';
            if (target.includes('metrics')) {
                return `
# HELP http_requests_total Total number of HTTP requests made.
# TYPE http_requests_total counter
http_requests_total{method="GET",handler="/api/v1/health",status="200"} 184291
http_requests_total{method="POST",handler="/api/v1/deploy",status="200"} 412
http_requests_total{status="500"} 0

# HELP cluster_node_cpu_utilization Ratio of CPU usage per node.
# TYPE cluster_node_cpu_utilization gauge
cluster_node_cpu_utilization{node="ip-10-0-1-12"} 0.38
cluster_node_cpu_utilization{node="ip-10-0-2-34"} 0.44

# HELP platform_uptime_seconds Overall cluster uptime.
# TYPE platform_uptime_seconds gauge
platform_uptime_seconds 7257600 (99.999% SLA)
`;
            } else if (target.includes('health') || target.includes('greeting')) {
                return `{"status": "HEALTHY", "tier": "production", "ready": true, "timestamp": "${new Date().toISOString()}"}`;
            } else {
                return `curl: try 'curl /metrics' or 'curl /health'`;
            }
        },

        cat: (args) => {
            const file = args[0] || '';
            if (file === 'resume.txt' || file === 'resume.md' || file === 'resume') {
                return `
============================================================
AHMED FATHY - SENIOR DEVOPS & CLOUD PLATFORM ENGINEER
Email: ahmed.fathy@gmail.com | Remote / Worldwide
============================================================

SUMMARY:
Results-driven DevOps & SRE Engineer with deep expertise in
HashiCorp Terraform, HashiCorp Vault, Kubernetes (EKS),
GitOps (ArgoCD), and Zero-Trust Security. Proven track record
architecting multi-region cloud infrastructures with 99.99% uptime.

CORE COMPETENCIES:
• Cloud: AWS (EKS, VPC, RDS, IAM, CloudFront, Route53)
• IaC: Terraform, Terragrunt, OpenTofu, Ansible, Packer
• Orchestration: Kubernetes, Docker, Helm, Istio, Cilium
• GitOps & CI/CD: ArgoCD, Argo Rollouts, GitHub Actions
• Security: HashiCorp Vault, Trivy, Cosign, OPA, Kyverno
• Observability: Prometheus, Grafana, Alertmanager, Loki

CERTIFICATIONS:
• HashiCorp Certified: Terraform Associate
• HashiCorp Certified: Vault Associate
• Certified Kubernetes Administrator (CKA)
• AWS Certified Solutions Architect
`;
            } else {
                return `cat: ${file}: No such file. Try 'cat resume.txt'`;
            }
        },

        uptime: () => {
            return `08:54:33 up 84 days, 14:22, 1 user, load average: 0.12, 0.08, 0.05 | SLA: 99.999%`;
        },

        contact: () => {
            return `
Email:    <a href="mailto:ahmed.fathy@gmail.com" class="text-accent">ahmed.fathy@gmail.com</a>
LinkedIn: <a href="https://linkedin.com/in/ahmed-fathy-devops" target="_blank" class="text-accent">linkedin.com/in/ahmed-fathy-devops</a>
GitHub:   <a href="https://github.com/AhmedELShafaie" target="_blank" class="text-accent">github.com/AhmedELShafaie</a>
`;
        },

        clear: () => {
            terminalOutput.innerHTML = '';
            return null;
        },

        sudo: () => {
            return `<span class="text-danger">ahmed is not in the sudoers file. This incident will be reported to /dev/null.</span>`;
        }
    };

    function executeCommand(rawInput) {
        const trimmed = rawInput.trim();
        if (!trimmed) return;

        // Add to history
        commandHistory.push(trimmed);
        historyIndex = commandHistory.length;

        // Print input prompt line
        const promptDiv = document.createElement('div');
        promptDiv.className = 'term-line prompt-line';
        promptDiv.innerHTML = `<span class="prompt-user text-success">ahmed@cloud-shell</span>:<span class="prompt-dir text-accent">~/infra</span>$ <span class="term-cmd">${escapeHtml(trimmed)}</span>`;
        terminalOutput.appendChild(promptDiv);

        const parts = trimmed.split(/\s+/);
        const cmdName = parts[0].toLowerCase();
        const cmdArgs = parts.slice(1);

        let outputText = '';
        if (commands[cmdName]) {
            outputText = commands[cmdName](cmdArgs);
        } else {
            outputText = `<span class="text-danger">command not found: ${escapeHtml(cmdName)}</span>. Type <span class="text-accent">'help'</span> for a list of commands.`;
        }

        if (outputText !== null && outputText !== '') {
            const respDiv = document.createElement('div');
            respDiv.className = 'term-response text-slate-300';
            respDiv.innerHTML = outputText;
            terminalOutput.appendChild(respDiv);
        }

        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }

    function escapeHtml(str) {
        return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    // Input Key Listeners
    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const cmd = terminalInput.value;
            terminalInput.value = '';
            executeCommand(cmd);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (commandHistory.length > 0 && historyIndex > 0) {
                historyIndex--;
                terminalInput.value = commandHistory[historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                terminalInput.value = commandHistory[historyIndex];
            } else {
                historyIndex = commandHistory.length;
                terminalInput.value = '';
            }
        } else if (e.key === 'Tab') {
            e.preventDefault();
            const current = terminalInput.value.toLowerCase().trim();
            const matches = Object.keys(commands).filter(c => c.startsWith(current));
            if (matches.length === 1) {
                terminalInput.value = matches[0];
            }
        }
    });

    // Quick Command Buttons
    quickCmdButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const cmd = btn.getAttribute('data-cmd');
            if (cmd) {
                executeCommand(cmd);
            }
        });
    });

    // Clear Button
    if (termClearBtn) {
        termClearBtn.addEventListener('click', () => {
            commands.clear();
        });
    }
});
