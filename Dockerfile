ARG VCS_REF=unknown
FROM node:22-alpine AS build
ARG VCS_REF
LABEL org.opencontainers.image.source="https://github.com/lec-org/lec-doc-web" \
      org.opencontainers.image.revision="$VCS_REF"
RUN corepack enable && corepack prepare pnpm@11.25.0 --activate
WORKDIR /workspace
COPY packages/lec-doc-editor packages/lec-doc-editor
COPY apps/lec-doc-web apps/lec-doc-web
WORKDIR /workspace/apps/lec-doc-web
RUN pnpm install --frozen-lockfile && pnpm build

FROM nginx:1.29-alpine
ARG VCS_REF
LABEL org.opencontainers.image.source="https://github.com/lec-org/lec-doc-web" \
      org.opencontainers.image.revision="$VCS_REF"
ENV BACKEND_HOST=host.docker.internal:3000
COPY apps/lec-doc-web/nginx.conf /etc/nginx/templates/default.conf.template
COPY --from=build /workspace/apps/lec-doc-web/dist /usr/share/nginx/html
EXPOSE 80
