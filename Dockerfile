# Step 1: Use a small official Nginx image
FROM nginx:alpine

# Step 2: Remove default nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Step 3: Copy your portfolio files into the nginx web root
COPY . /usr/share/nginx/html

# Step 4: Expose port 80 (inside container)
EXPOSE 80

# Step 5: Start nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
