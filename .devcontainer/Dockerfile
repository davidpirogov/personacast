ARG DEBIAN_VERSION="bookworm"
ARG NODE_VERSION="22"

FROM mcr.microsoft.com/devcontainers/typescript-node:${NODE_VERSION}-${DEBIAN_VERSION}

# Update and install essential packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /workspace/data && chmod 0755 /workspace/data

WORKDIR /workspace