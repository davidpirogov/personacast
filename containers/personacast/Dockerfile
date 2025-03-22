ARG DEBIAN_VERSION="bookworm"
ARG NODE_VERSION="22.14"

FROM node:${NODE_VERSION}-${DEBIAN_VERSION} AS builder
WORKDIR /build

RUN corepack enable pnpm && pnpm -v

COPY package*.json ./
COPY pnpm-lock.yaml ./
RUN pnpm install

COPY . ./
RUN pnpm build

FROM node:${NODE_VERSION}-${DEBIAN_VERSION}

WORKDIR /app

COPY --from=builder /build/dist ./dist
COPY --from=builder /build/node_modules ./node_modules
# Set non-interactive frontend to avoid prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Create a non-root user
ARG USER_ID=1000
ARG GROUP_ID=1000

# Update and install essential packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create a non-root user and group
RUN if getent group ${GROUP_ID} ; then \
        echo "Group ${GROUP_ID} already exists" ; \
    else \
        groupadd -g ${GROUP_ID} personacast ; \
    fi && \
    if getent passwd ${USER_ID} ; then \
        echo "User ${USER_ID} already exists" ; \
    else \
        useradd -u ${USER_ID} -g ${GROUP_ID} -m -s /bin/bash -l personacast ; \
    fi

RUN mkdir -p /app/data && \
    chown -R ${USER_ID}:${GROUP_ID} /app/data && \
    chmod 0755 /app/data

# Switch to non-root user
USER ${USER_ID}

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

VOLUME [ "/app/data" ]

ENV NODE_ENV production

CMD ["pnpm", "start"]