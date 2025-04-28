# syntax = docker/dockerfile:experimental

# Default to PHP 8.2 and Node 18
ARG PHP_VERSION=8.2
ARG NODE_VERSION=18

# Stage 1: nginx
FROM nginx as nginx
COPY nginx.conf /etc/nginx/conf.d/nginx.conf

# Stage 2: base PHP image
FROM fideloper/fly-laravel:${PHP_VERSION} as base
ARG PHP_VERSION
LABEL fly_launch_runtime="laravel"

COPY . /var/www/html

# Install composer dependencies
RUN composer install --optimize-autoloader --no-dev \
    && mkdir -p storage/logs \
    && php artisan optimize:clear \
    && chown -R www-data:www-data /var/www/html

# Additional PHP settings, if needed
RUN sed -i 's/protected \$proxies/protected \$proxies = "*"/g' app/Http/Middleware/TrustProxies.php

# Set up cron
RUN echo "MAILTO=\"\"\n* * * * * www-data /usr/bin/php /var/www/html/artisan schedule:run" > /etc/cron.d/laravel

# COPY .fly/entrypoint.sh /entrypoint
# RUN chmod +x /entrypoint

# Set up Octane if present
RUN if grep -Fq "laravel/octane" /var/www/html/composer.json; then \
        rm -rf /etc/supervisor/conf.d/fpm.conf; \
        if grep -Fq "spiral/roadrunner" /var/www/html/composer.json; then \
            mv /etc/supervisor/octane-rr.conf /etc/supervisor/conf.d/octane-rr.conf; \
            [ -f ./vendor/bin/rr ] && ./vendor/bin/rr get-binary; \
        else \
            mv .fly/octane-swoole /etc/services.d/octane; \
            mv /etc/supervisor/octane-swoole.conf /etc/supervisor/conf.d/octane-swoole.conf; \
        fi; \
        rm /etc/nginx/sites-enabled/default; \
        ln -sf /etc/nginx/sites-available/default-octane /etc/nginx/sites-enabled/default; \
    fi

# Stage 3: Node build for assets
FROM node:${NODE_VERSION} as node_modules_go_brrr
WORKDIR /app
COPY . .
COPY --from=base /var/www/html/vendor /app/vendor

# Build assets with yarn/npm/pnpm
RUN if [ -f "vite.config.js" ]; then ASSET_CMD="build"; else ASSET_CMD="production"; fi; \
    if [ -f "yarn.lock" ]; then \
        yarn install --frozen-lockfile; \
        yarn $ASSET_CMD; \
    elif [ -f "pnpm-lock.yaml" ]; then \
        corepack enable && corepack prepare pnpm@latest-7 --activate; \
        pnpm install --frozen-lockfile; \
        pnpm run $ASSET_CMD; \
    elif [ -f "package-lock.json" ]; then \
        npm ci --no-audit; \
        npm run $ASSET_CMD; \
    else \
        npm install; \
        npm run $ASSET_CMD; \
    fi;

# Final stage: Merging all layers and assets
FROM base
COPY --from=node_modules_go_brrr /app/public /var/www/html/public-npm
RUN rsync -ar /var/www/html/public-npm/ /var/www/html/public/ \
    && rm -rf /var/www/html/public-npm \
    && chown -R www-data:www-data /var/www/html/public

# Set port
EXPOSE 8080

ENTRYPOINT ["/entrypoint"]
