FROM node:13.8.0-alpine

RUN addgroup -S nupp && adduser -S -g nupp nupp
RUN apk update && apk add --virtual build-dependencies build-base gcc wget git unzip
RUN wget -O /tmp/master.zip https://github.com/troydhanson/uthash/archive/master.zip
RUN unzip /tmp/master.zip -d /tmp
RUN rm -rf /tmp/*

ENV HOME=/home/nupp

COPY ./src $HOME/src
COPY ./build $HOME/build
COPY ./package.json $HOME/
COPY ./.babelrc $HOME/
RUN node -v

ADD https://github.com/Yelp/dumb-init/releases/download/v1.2.0/dumb-init_1.2.0_amd64 /usr/local/bin/dumb-init

WORKDIR $HOME

RUN chown -R nupp:nupp $HOME/* /usr/local/ && \
    chmod +x /usr/local/bin/dumb-init && \
    # npm cache clean --force&& \
    npm install --silent --progress=false && \
    npm run build && \
    npm prune --production && \
    chown -R nupp:nupp $HOME/*

USER nupp

EXPOSE 3000

CMD ["dumb-init", "npm", "start"]
