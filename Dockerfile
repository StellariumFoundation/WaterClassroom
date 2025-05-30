# Build stage
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files for better caching
COPY package.json package-lock.json* ./

# Install dependencies - changed from npm ci to npm install to handle missing package-lock.json
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Create .env file with placeholder API key that will be replaced at runtime
RUN echo "GEMINI_API_KEY=RUNTIME_PLACEHOLDER" > .env.production

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy the built files from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx configuration to handle client-side routing
RUN echo 'server { \
    listen 80; \
    server_name _; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    # Cache static assets \
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ { \
        expires 30d; \
        add_header Cache-Control "public, no-transform"; \
    } \
    # No cache for HTML files \
    location ~* \.html$ { \
        add_header Cache-Control "no-cache"; \
    } \
}' > /etc/nginx/conf.d/default.conf


RUN printf '%s\n' \
    '#!/bin/sh' \
    '# Replace RUNTIME_PLACEHOLDER with actual API key at container startup' \
    'if [ ! -z "$GEMINI_API_KEY" ]; then' \
    '  find /usr/share/nginx/html -type f -name "*.js" -exec sed -i "s/RUNTIME_PLACEHOLDER/$GEMINI_API_KEY/g" {} \;' \
    'fi' \
    '# Start nginx' \
    'nginx -g "daemon off;"' > /docker-entrypoint.sh && \
    chmod +x /docker-entrypoint.sh
    
# Expose port 80
EXPOSE 80

# Set the entrypoint script
ENTRYPOINT ["/docker-entrypoint.sh"]
