# Adjust BUN_VERSION as desired
ARG BUN_VERSION=1.3.5
FROM oven/bun:${BUN_VERSION}-slim as base

LABEL fly_launch_runtime="Bun"

# Set production environment
WORKDIR /app
ENV NODE_ENV="production"

FROM base as build

# Install packages needed to build the package
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential pkg-config python-is-python3

# Copy Files
COPY --link package.json tsconfig.json ./
COPY --link packages ./packages
COPY --link apps/admin ./apps/admin

# Install dependencies
RUN bun install --ci
RUN cd apps/admin && bun install --ci

# build
RUN cd apps/admin && bun run build

# Finally, build the production image with minimal footprint
FROM base

COPY --from=build /app/apps/admin/node_modules /app/node_modules
COPY --from=build /app/apps/admin/build /app/build
COPY --from=build /app/apps/admin/package.json /app/package.json
COPY --from=build /app/apps/admin/server.js /app/server.js

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD bun start
