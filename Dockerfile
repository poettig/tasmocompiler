FROM node:20-slim as base
LABEL maintainer="Piotr Antczak <antczak.piotr@gmail.com>"

ENV PATH="$PATH:/root/.local/bin"
ENV LC_ALL=C.UTF-8
ENV LANG=C.UTF-8
ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && \
    apt-get install -y git pipx && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
RUN pipx install platformio



FROM node:20-slim as build

ADD index.html vite.config.mjs package.json package-lock.json /tasmocompiler/
ADD public /tasmocompiler/public/
ADD src /tasmocompiler/src/
RUN cd /tasmocompiler && npm ci && npm run build && rm -r node_modules



FROM base as prod

ENV NODE_ENV=production

ADD package.json package-lock.json /tasmocompiler/
ADD server /tasmocompiler/server/
RUN cd /tasmocompiler && npm ci --omit=dev

COPY --from=build /tasmocompiler/build /tasmocompiler/build/

WORKDIR /tasmocompiler
ENTRYPOINT ["node", "/tasmocompiler/server/app.js"]