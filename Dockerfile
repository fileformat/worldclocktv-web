FROM node:20-bookworm-slim
RUN groupadd -r appuser && \
	useradd --create-home --gid appuser --home-dir /app --no-log-init --system appuser

ARG COMMIT="(not set)"
ARG LASTMOD="(not set)"
ENV COMMIT=$COMMIT
ENV LASTMOD=$LASTMOD
WORKDIR /app
USER appuser
COPY --chown=appuser:appuser . .
RUN npm install
EXPOSE 4000
ENV PORT 4000
CMD ["npm", "start"]

