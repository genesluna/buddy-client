FROM node:22.22.3-slim

USER node

WORKDIR /home/node/app

CMD ["tail", "-f", "/dev/null"]