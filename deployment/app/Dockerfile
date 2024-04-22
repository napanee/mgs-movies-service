FROM node:20-slim as base

ENV CONTAINER_USER=container

RUN set -ex \
	&& groupadd -r $CONTAINER_USER --gid=99 \
	&& useradd -r -M -g $CONTAINER_USER -s /usr/sbin/nologin --uid=99 $CONTAINER_USER \
	&& apt-get update \
	&& apt-get install -y --no-install-recommends \
		mime-support \
		locales \
		gosu \
	&& rm -rf /var/lib/apt/lists/* \
	&& echo "en_US.UTF-8 UTF-8" >> /etc/locale.gen \
	&& locale-gen \
	&& update-locale LANG=en_US.UTF-8


FROM base as builder

WORKDIR /build

RUN mkdir -p /build/client/
RUN mkdir -p /build/server/

COPY package.json package-lock.json /build/
COPY client/package.json /build/client
COPY server/package.json /build/server

RUN set -ex \
	&& npm ci --quiet --loglevel=error \
	&& rm -fr /root/.npm/ \
	&& rm -fr /root/.node-gyp/

COPY . /build/

RUN npm run generate:graphql
RUN npm run build


FROM base as app

RUN mkdir -p /app/server/

COPY package.json package-lock.json deployment/app/entrypoint.sh /app/
COPY server/package.json /app/server
COPY --from=builder /build/dist/ /app/dist/

WORKDIR /app

RUN set -ex \
	&& npm ci -w server --quiet --loglevel=error \
	&& rm -fr /root/.npm/ \
	&& rm -fr /root/.node-gyp/

ARG BUILD
ENV BUILD=$BUILD

ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["node", "dist/src/server.js"]
