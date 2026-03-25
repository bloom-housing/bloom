# To update, find the latest stable version from:
# https://hub.docker.com/r/amazon/aws-otel-collector/tags
#
# Explicitly pin the version tag and image sha.
FROM docker.io/amazon/aws-otel-collector:v0.47.0@sha256:40a7eb9bfa58871d5d6dbdfcb146bc9d7eb4f149b42bd653809cd5b980af0cc4

COPY --chown=aoc:aoc *.yaml /etc/
