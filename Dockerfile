FROM node:20-alpine
WORKDIR /app
COPY package.json server.js ./
COPY public ./public
EXPOSE 3000
HEALTHCHECK --interval=10s --timeout=3s --retries=3 CMD wget -qO- http://localhost:3000/health || exit 1
USER node
CMD ["node", "server.js"]
