FROM node:20-slim
LABEL maintainer="Piotr Antczak <antczak.piotr@gmail.com>"

ENV PATH="$PATH:/root/.local/bin"
ENV LC_ALL=C.UTF-8
ENV LANG=C.UTF-8
ENV NODE_OPTIONS=--openssl-legacy-provider

RUN apt-get update &&  \
    DEBIAN_FRONTEND=noninteractive apt-get install -y python3 python3-venv git python3-setuptools pipx &&  \
    DEBIAN_FRONTEND=noninteractive apt-get clean &&  \
    rm -rf /var/lib/apt/lists/*
RUN pipx install platformio
RUN cd /tmp && git clone https://github.com/arendst/Tasmota.git

# Update dependencies first
ADD package.json yarn.lock .yarnrc /tasmocompiler/
RUN cd /tasmocompiler && yarn install && yarn cache clean

# Then build the server
ADD public /tasmocompiler/public/
ADD server /tasmocompiler/server/
ADD src /tasmocompiler/src/
RUN cd /tasmocompiler && yarn build && yarn cache clean

WORKDIR /tasmocompiler
ENTRYPOINT ["node", "/tasmocompiler/server/app.js"]