FROM mhart/alpine-node:8 as base
RUN apk update && apk upgrade && apk add --no-cache \
    bash \
    git \
    openssh
RUN adduser -D appuser -h /app

WORKDIR /app
ARG COMMIT="(not set)"
ARG LASTMOD="(not set)"
ENV COMMIT=$COMMIT
ENV LASTMOD=$LASTMOD
USER appuser
COPY --chown=appuser:appuser . .
RUN npm install
EXPOSE 4000
ENV PORT 4000
CMD ["npm", "start"]

