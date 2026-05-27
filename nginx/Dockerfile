FROM nginx:1.25-alpine

# Remove default config
RUN rm /etc/nginx/conf.d/default.conf /etc/nginx/nginx.conf

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Create uploads directory
RUN mkdir -p /var/www/uploads

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
