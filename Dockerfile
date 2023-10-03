FROM node:18-slim
LABEL maintainer="Piotr Antczak <antczak.piotr@gmail.com>"

ENV PATH="$PATH:/root/.local/bin"
ENV LC_ALL=C.UTF-8
ENV LANG=C.UTF-8
ENV NODE_ENV=production
ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update &&  \
    apt-get install -y git pipx &&  \
    apt-get clean &&  \
    rm -rf /var/lib/apt/lists/*
RUN pipx install platformio

ADD package.json yarn.lock .yarnrc /tasmocompiler/
ADD public /tasmocompiler/public/
ADD server /tasmocompiler/server/
ADD src /tasmocompiler/src/
RUN cd /tasmocompiler && yarn install && yarn build && yarn cache clean

WORKDIR /tasmocompiler
ENTRYPOINT ["node", "/tasmocompiler/server/app.js"]
