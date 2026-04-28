# Hyper Arena

Esports tournament registration app built with Vite, React, TypeScript, Tailwind, and Supabase.

## Local development

```bash
npm ci
npm run dev
```
## Production build







```bash
npm run build
npm run preview
```

## GitHub Pages deploy (cybersoulz.tech)

This repo uses GitHub Actions for deployment via [.github/workflows/deploy-pages.yml](.github/workflows/deploy-pages.yml).

### One-time GitHub setup

1. Open repository Settings -> Pages.
2. Set Source to GitHub Actions.
3. Add Actions Variables in Settings -> Secrets and variables -> Actions:
4. `VITE_SUPABASE_URL` = your Supabase project URL.
5. `VITE_SUPABASE_PUBLISHABLE_KEY` = your Supabase publishable key.
6. In Pages, set Custom domain to `cybersoulz.tech`.
7. Enable Enforce HTTPS.

### DNS setup for cybersoulz.tech

1. Add A records for apex domain (`@`):
2. `185.199.108.153`
3. `185.199.109.153`
4. `185.199.110.153`
5. `185.199.111.153`
6. Add a CNAME record for `www` pointing to `YOUR_GITHUB_USERNAME.github.io`.

### Deploy flow

1. Push to `main`.
2. Workflow builds and deploys `dist` to GitHub Pages.
3. A SPA fallback is generated as `404.html` so direct route refresh (like `/tournaments`) works.

### Optional manual deploy

Run the workflow manually from Actions -> Deploy GitHub Pages -> Run workflow.
