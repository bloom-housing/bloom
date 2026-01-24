# To update, find the latest stable version from:
# https://hub.docker.com/_/postgres/tags
#
# Explicitly pin the version tag and image sha.
FROM docker.io/postgres:14.20@sha256:5773fe724c49c42a7a9ca70202e11e1dff21fb7235b335a73f39297d200b73a2

COPY --chown=postgres:postgres docker-entrypoint.bash *.sql .

ENTRYPOINT [ "./docker-entrypoint.bash" ]
