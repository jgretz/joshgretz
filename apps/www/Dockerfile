# Adjust BUN_VERSION as desired
ARG BUN_VERSION=1.1.4
FROM oven/bun:${BUN_VERSION}-slim as base

LABEL fly_launch_runtime="Bun"

# set for base and all layer that inherit from it
ENV NODE_ENV production

# Install all node_modules, including dev
FROM base as deps

WORKDIR /remixapp

ADD package.json bun.lockb ./
RUN bun install --include=dev

# Setup production node_modules
FROM base as production-deps

WORKDIR /remixapp

COPY --from=deps /remixapp/node_modules /remixapp/node_modules
ADD package.json bun.lockb ./
RUN rm -rf /remixapp/node_modules
RUN bun install --production

# Build the app
FROM base as build

WORKDIR /remixapp

COPY --from=deps /remixapp/node_modules /remixapp/node_modules
ADD package.json bun.lockb postcss.config.js tailwind.config.cjs tsconfig.json vite.config.ts ./
ADD app/ app/
ADD public/ public/

RUN bun run build

# Finally, build the production image with minimal footprint
FROM base

ENV PORT="3000"
ENV NODE_ENV="production"

WORKDIR /remixapp

COPY --from=production-deps /remixapp/node_modules /remixapp/node_modules
COPY --from=build /remixapp/build /remixapp/build
COPY --from=build /remixapp/package.json /remixapp/package.json

ADD server.js ./

EXPOSE 3000
CMD ["bun", "start"]
