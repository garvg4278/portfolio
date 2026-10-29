# Stage 1: build the static site (Node is only needed here)
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build && npm run check:links

# Stage 2: serve it with nginx (this is the image that gets published)
FROM nginx:alpine
LABEL org.opencontainers.image.source="https://github.com/garvg4278/portfolio"
LABEL org.opencontainers.image.description="Garv Gupta portfolio: static site served by nginx"
RUN rm -rf /usr/share/nginx/html/*
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY portfolio-headers.conf /etc/nginx/snippets/portfolio-headers.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -q --spider http://127.0.0.1/ || exit 1
CMD ["nginx", "-g", "daemon off;"]
