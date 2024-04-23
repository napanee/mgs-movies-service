#!/usr/bin/env sh
set -e

echo "COMMIT=$BUILD"
if ! [ "$1" = "bash" ] && [ "$(id -u)" = '0' ]; then
	exec gosu "$CONTAINER_USER" "$@"
fi

exec $@
