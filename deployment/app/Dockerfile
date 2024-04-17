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

COPY package.json package-lock.json /build/

RUN set -ex \
	&& npm ci --quiet --loglevel=error \
	&& rm -fr /root/.npm/ \
	&& rm -fr /root/.node-gyp/

COPY . /build/

RUN npm run types:generate
RUN npm run build


FROM base as app

COPY deployment/app/entrypoint.sh /app/
COPY --from=builder /build/build/ /app/build/

WORKDIR /app/build/

ARG BUILD
ENV BUILD=$BUILD

ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["node", "build/server.js"]
