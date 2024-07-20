FROM node:20.15.0-slim

USER node

WORKDIR /home/node/app

CMD ["tail", "-f", "/dev/null"]