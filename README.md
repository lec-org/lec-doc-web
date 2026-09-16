# Lec Doc Web

Lec Doc Web is the standalone Community browser client used by the Lec platform. It provides collaborative page editing, navigation trees, search, comments, history, attachments, public shares, and workspace administration.

The browser experience uses this client. LecIM Desktop is designed to load the same deployment after its subject-bound handoff API is implemented; until then the Desktop entry remains fail-closed.

## Requirements

- Node.js 22.22.2 or newer
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

## LecSSO 登录与会话清理

用户通过登录页的「使用 LecSSO 登录」进入服务端 OIDC 流程。Web 不持有 client secret 或 IdP token；API 同源且使用 Secure HttpOnly 会话 Cookie，axios 自动发送会话绑定的 CSRF Cookie/header。

开发时需在 Vite 和 API 前使用同源 HTTPS 代理；上文 `APP_URL` 是 Vite 的后端代理目标，服务端的 `APP_URL` 必须设置为浏览器实际访问的 HTTPS origin。HTTP 直连不满足 Secure Cookie 和 OIDC 的要求。

401/403、注销及其他标签页的注销广播统一锁定私密界面，关闭编辑器与实时连接，清空 React Query 和本产品的 IndexedDB。文档缓存按 workspace、用户和每次登录 nonce 隔离；清理失败保持锁定，不恢复显示旧正文。

当前仅完成 Phase 1 身份边界；中文完整主路径、Core 在线权限和 Desktop handoff 在后续阶段验收。
