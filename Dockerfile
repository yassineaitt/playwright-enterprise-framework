# syntax=docker/dockerfile:1.7
# Runs the full suite headless. Browsers + OS deps come from the official image,
# pinned to the exact Playwright version in package.json so host and container agree.
ARG PLAYWRIGHT_VERSION=1.64.1
FROM mcr.microsoft.com/playwright:v${PLAYWRIGHT_VERSION}-noble AS base

ENV CI=1 \
    NODE_ENV=test \
    NPM_CONFIG_UPDATE_NOTIFIER=false \
    NPM_CONFIG_FUND=false

WORKDIR /app

# Dependency layer – cached unless the lockfile changes.
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --ignore-scripts

# Source layer
COPY tsconfig.json playwright.config.ts ./
COPY src ./src
COPY tests ./tests

# Non-root for the test run; the base image already ships this user.
RUN chown -R pwuser:pwuser /app
USER pwuser

ENTRYPOINT ["npx", "playwright", "test"]
CMD ["--reporter=list"]
