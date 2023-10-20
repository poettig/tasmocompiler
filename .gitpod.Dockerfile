FROM node:20-slim
RUN apt-get update && apt-get install -y pipx git
ENV LC_ALL=C.UTF-8 LANG=C.UTF-8