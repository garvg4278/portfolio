FROM nginx:alpine
LABEL org.opencontainers.image.source="https://github.com/garvg4278/portfolio"

RUN rm -rf /usr/share/nginx/html/*
COPY . /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
