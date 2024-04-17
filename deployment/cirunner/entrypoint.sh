#!/usr/bin/env sh
set -e

ln -s /ci/node_modules /app/node_modules || true

exec $@
