FROM node:20-slim

ENV PATH=/ci/node_modules/.bin:$PATH \
	NODE_PATH=/ci/node_modules

RUN set -ex \
	&& apt-get update \
	&& apt-get install -y --no-install-recommends \
		make \
		locales \
		gosu \
	&& rm -rf /var/lib/apt/lists/* \
	&& echo "en_US.UTF-8 UTF-8" >> /etc/locale.gen \
    && locale-gen \
	&& update-locale LANG=en_US.UTF-8

WORKDIR /ci

RUN mkdir -p /ci/client/
RUN mkdir -p /ci/server/

COPY package.json package-lock.json /ci/
COPY client/package.json /ci/client
COPY server/package.json /ci/server

RUN set -ex \
	&& npm ci --quiet --loglevel=error --ignore-scripts \
	&& rm -fr /root/.npm/ \
	&& rm -fr /root/.node-gyp/ \
	&& mkdir -p /.npm && chmod 777 -R /.npm \
	&& mkdir -p /ci/node_modules/.cache && chmod 777 -R /ci/node_modules/.cache \
	&& npm rebuild bcrypt

WORKDIR /app

CMD ["bash"]
