# CLAUDE.md

Static DevOps/SRE portfolio site for Ahmed Fathy. No build step, no package manager: plain HTML, CSS and vanilla JS served by unprivileged Nginx, with Docker, Kubernetes and Terraform deployment configs alongside.

## Layout

- `index.html` (whole site, with an inline `<head>` script that sets `data-theme` before paint), `css/style.css`, `js/app.js` (theme, pipeline stepper, skills filter, contact form), `js/terminal.js` (simulated CLI).
- `nginx.conf`, `Dockerfile`, `docker-compose.yml`, `k8s/` (Kustomize), `terraform/` (S3 + CloudFront OAC), `.github/workflows/ci-cd.yml`.

## Commands

- `make help` lists targets. Main ones: `make docker-run` (serves on http://localhost:8080), `make k8s-dry-run`, `make tf-plan`.
- Quick UI work: open `index.html` directly or run `python -m http.server`.
- `make lint` only checks that files exist; it is not a real HTML/CSS linter. There is no test suite, so verify UI changes in a browser in both themes at desktop and mobile widths.

## Conventions and gotchas

- **Keep it dependency-free.** No frameworks, bundlers or npm. Vanilla ES6+ only.
- **New asset files must be wired in.** The Dockerfile copies only `index.html`, `css/` and `js/`, so anything else is silently missing from the image. Also update the file checks in `ci-cd.yml` and the Dockerfile builder stage if the file is critical.
- **CSP is strict** (`nginx.conf`): scripts from `'self'`, inline and cdnjs; styles/fonts from `'self'`, Google Fonts and cdnjs; `connect-src 'self'`. Update the CSP when adding any external resource.
- **Theming:**
  - Every color comes from a CSS variable defined in both the `[data-theme="dark"]` and `[data-theme="light"]` blocks.
  - Keep WCAG AA contrast in light mode.
  - Theme is stored in `localStorage` under `theme`; all access is wrapped in try/catch.
  - Public API: `window.setPortfolioTheme`, `togglePortfolioTheme`, `resetPortfolioThemeToAuto`, plus the `themeChanged` event. The terminal's `theme` command depends on it.
  - Keep the `<head>` bootstrapper in sync with the logic in `app.js`.
- **Accessibility:** keep `role="switch"` and `aria-*` on the toggle; honor `prefers-reduced-motion`.
- **Terminal commands** are simulated with canned output. When adding one, update autocomplete and the README command list.
- **Containers stay non-root** (UID 101, port 8080). Don't add anything that needs root or privileged ports.
- Update `README.md` when features or repo structure change.

## Git workflow

- Feature branch, then PR into `main`. Pushes to `main` build and push the image to GHCR.
- Commit messages follow Conventional Commits (`feat(ui):`, `fix(theme):`, `style:`).
- CI runs file checks, a non-blocking Trivy scan and a Docker build. It doesn't validate Terraform or k8s, so run `make k8s-dry-run` and `terraform validate` locally.
