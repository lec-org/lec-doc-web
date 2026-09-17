ARG VCS_REF
ARG PLATFORM_VCS_REF
ARG EDITOR_VCS_REF
FROM node:22-alpine@sha256:c610fcdfb1d5b4740dd70c284ed3cb16bb857e0f7166196e36a5501df7a3aa32 AS build
ARG VCS_REF
ARG PLATFORM_VCS_REF
ARG EDITOR_VCS_REF
RUN for ref in "$VCS_REF" "$PLATFORM_VCS_REF" "$EDITOR_VCS_REF"; do printf '%s\n' "$ref" | grep -Eq '^[0-9a-f]{40}$'; done
ENV LEC_DOC_WEB_SOURCE_REF=$VCS_REF
LABEL org.opencontainers.image.source="https://github.com/lec-org/lec-doc-web" \
      org.opencontainers.image.revision="$VCS_REF" \
      io.lec.platform.revision="$PLATFORM_VCS_REF" \
      io.lec.doc-editor.revision="$EDITOR_VCS_REF"
WORKDIR /workspace
RUN --mount=type=secret,id=npm_ca,required=false,target=/tmp/npm-ca.pem \
    test ! -s /tmp/npm-ca.pem || export NODE_EXTRA_CA_CERTS=/tmp/npm-ca.pem; \
    corepack enable && corepack prepare pnpm@11.25.0 --activate
COPY packages/lec-doc-editor packages/lec-doc-editor
COPY apps/lec-doc-web apps/lec-doc-web
WORKDIR /workspace/apps/lec-doc-web
RUN --mount=type=secret,id=npm_ca,required=false,target=/tmp/npm-ca.pem \
    test ! -s /tmp/npm-ca.pem || export NODE_EXTRA_CA_CERTS=/tmp/npm-ca.pem; \
    pnpm --dir ../../packages/lec-doc-editor install --frozen-lockfile && pnpm --dir ../../packages/lec-doc-editor build && pnpm install --frozen-lockfile && cp -R ../../packages/lec-doc-editor/dist node_modules/@lec/doc-editor/dist && pnpm build

FROM nginx:1.29-alpine@sha256:5616878291a2eed594aee8db4dade5878cf7edcb475e59193904b198d9b830de
ARG VCS_REF
ARG PLATFORM_VCS_REF
ARG EDITOR_VCS_REF
LABEL org.opencontainers.image.source="https://github.com/lec-org/lec-doc-web" \
      org.opencontainers.image.revision="$VCS_REF" \
      io.lec.platform.revision="$PLATFORM_VCS_REF" \
      io.lec.doc-editor.revision="$EDITOR_VCS_REF"
ENV BACKEND_HOST=host.docker.internal:3000 \
    COLLAB_HOST=host.docker.internal:3001 \
    LEC_DOC_HOST=doc.localhost
COPY apps/lec-doc-web/nginx.conf /etc/nginx/templates/default.conf.template
COPY --from=build /workspace/apps/lec-doc-web/dist /usr/share/nginx/html
EXPOSE 443
