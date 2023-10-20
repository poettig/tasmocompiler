FROM node:20-slim
LABEL maintainer="Piotr Antczak <antczak.piotr@gmail.com>"

ENV PATH="$PATH:/root/.local/bin"
ENV LC_ALL=C.UTF-8
ENV LANG=C.UTF-8
ENV NODE_ENV=development
ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update &&  \
    apt-get install -y git pipx &&  \
    apt-get clean &&  \
    rm -rf /var/lib/apt/lists/*
RUN pipx install platformio
