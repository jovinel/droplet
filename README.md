# Droplet

Droplet is a proof of concept for gauging interest in a water-refilling-station service. The proposed first phase will test whether people scan a QR code at a participating business and express interest through an early-signup flow.

## Planned first phase

1. A business places a QR code on its window or at the front of its water-refilling station.
2. A visitor scans the code and is directed to a service screen for early signups.
3. The screen may ask up to five questions to help gauge interest.
4. Afterward, a thank-you screen tells the visitor that the service will be implemented later.

This flow describes the plan for the proof of concept; the screens and service have not been implemented yet.

## Application foundation

The repository contains a React/TypeScript Vite frontend and a Convex read-only health query. The shell reports backend readiness; it does not implement the early-signup flow or store responses.

### Develop locally

Use Node.js 20.19+ or 22.12+ and npm. With access to the Droplet Convex project, configure a **cloud** development deployment (not an anonymous local deployment):

```sh
npm ci
npx convex login
npx convex dev --once --configure --dev-deployment cloud
```

Select the existing Droplet project when prompted. If this checkout was previously configured for a local deployment, run `npx convex deployment select dev` before `npx convex dev --once`. Convex writes the development deployment URL to `.env.local` and generates `convex/_generated`; do not commit `.env.local`. Then start the frontend:

```sh
npm run dev
```

The frontend needs `VITE_CONVEX_URL` pointing to that deployment. Copy `.env.example` to `.env.local` and replace the example URL if Convex has not populated it. Without a URL, the app shows a configuration message rather than connecting. `npx convex run health:check` should return `{ "ready": true }` once the query has been pushed. The URL is public client configuration; Convex credentials and deploy keys are secrets and must never use the `VITE_` prefix.

Run `npm run build`, `npx tsc --noEmit -p tsconfig.app.json`, and `npm run lint` to check the app. The production build is emitted to `dist`.

### Cloudflare Pages

Connect this repository using Pages Git integration with the project root as the build directory and `dist` as the output directory. Configure the following in Pages:

| Setting | Value |
| --- | --- |
| Build command | `npx convex deploy --cmd 'npm run build' --cmd-url-env-var-name VITE_CONVEX_URL` |
| Build output directory | `dist` |
| Build environment variable | `NODE_VERSION=22.12.0` (or another Vite-supported version) |
| Secret environment variable | `CONVEX_DEPLOY_KEY` |

Use a **production deployment key** for production builds and a **separate preview deploy key** for preview builds. Set the secret separately for Pages production and preview environments; do not let previews deploy functions to production. The build command injects the selected deployment URL into `VITE_CONVEX_URL` for the frontend and pushes `convex/health.ts` to the deployment selected by the key. Do not set a static Pages `VITE_CONVEX_URL` that might point at a different deployment.

After deploying with owner account access, confirm that the preview and production Pages sites each display “Convex is ready” and that preview builds use their own deployment. Cloudflare and Convex account access are required for this smoke test; a local build alone does not establish live connectivity.
