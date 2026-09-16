# Provenance

Lec export and modification date: 2026-09-16.

## Upstream

- Project: Docmost Community Edition
- Upstream version: 0.96.0
- Source revision: `6205bbeb908fe846f87dd6a2cbf562e24777db38`
- Git description: `v0.96.0-1-g6205bb`
- Upstream license: GNU Affero General Public License v3.0 only
- Upstream project: <https://github.com/docmost/docmost>

This tree was exported from the upstream `apps/client` source and adapted as the standalone Lec platform repository `apps/lec-doc-web`.

## Community-only scope

The export omitted the upstream `apps/client/src/ee` tree and does not contain or copy deleted Enterprise Edition implementation code. Enterprise-only imports, routes, controls, entitlement and trial prompts, and related client integrations were removed from the remaining Community source. The Enterprise-licensed `packages/base-formula` package is not used or declared.

The retained baseline covers Community collaborative editing, pages and page trees, page search, comments, history, attachments, shares, public spaces, and standard workspace/member management. The editor-extension dependency is the separately maintained AGPL package `@lec/doc-editor`, resolved from `file:../../packages/lec-doc-editor` in the parent platform.

## Lec distribution

Product-facing branding is changed to **Lec Doc**. The browser application is deployed from this repository, and LecIM Desktop is designed to load that same deployment after its subject-bound handoff is implemented; no second Desktop frontend is maintained.

## License obligations

The combined and modified client remains licensed under AGPL-3.0-only. Preserve `LICENSE`, this provenance notice, corresponding source availability, and applicable notices when distributing or providing the software over a network.
