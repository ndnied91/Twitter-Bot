FROM node

RUN apt-get update --yes && apt-get upgrade --yes

RUN useradd --create-home --user-group --shell /bin/false app && npm install --global npm@latest

USER app

RUN mkdir /home/app/twitter_bot && mkdir /home/app/twitter_bot/node_modules

WORKDIR /home/app/twitter_bot

COPY package.json npm-shrinkwrap.json /home/app/twitter_bot/

RUN npm install
