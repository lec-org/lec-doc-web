# Lec Doc Web

Lec Doc Web is the standalone Community browser client used by the Lec platform. It provides collaborative page editing, navigation trees, search, comments, history, attachments, public shares, and workspace administration.

The browser experience uses this client. LecIM Desktop is designed to load the same deployment after its subject-bound handoff API is implemented; until then the Desktop entry remains fail-closed.

## Requirements

- Node.js 22.13 or newer
- pnpm 11.25.0
- The sibling package `packages/lec-doc-editor` in the parent platform repository
- A compatible Community backend serving `/api`, `/collab`, and `/socket.io`

## Development

From the parent platform repository:

```sh
pnpm --dir apps/lec-doc-web install
APP_URL=http://localhost:3000 pnpm --dir apps/lec-doc-web dev
```

The Vite development server proxies API and WebSocket traffic to `APP_URL`.

## Checks

```sh
pnpm lint
pnpm test
pnpm build
```

## Static container

`Dockerfile` builds the client and serves it with nginx. At container startup, set `BACKEND_HOST` to the backend host and port (default `host.docker.internal:3000`):

```sh
docker build -t lec-doc-web -f apps/lec-doc-web/Dockerfile .
docker run --rm -p 8080:80 -e BACKEND_HOST=backend:3000 lec-doc-web
```

The nginx configuration serves the SPA and proxies `/api`, `/collab`, and `/socket.io` to that backend.

## License and origin

This repository is licensed under the GNU Affero General Public License v3.0 only; see `LICENSE`. It is derived from the AGPL Community client in Docmost 0.96.0 at upstream commit `6205bbeb908fe846f87dd6a2cbf562e24777db38` (`v0.96.0-1-g6205bb`). Enterprise-only source paths were not included or copied. See `PROVENANCE.md` for details.
