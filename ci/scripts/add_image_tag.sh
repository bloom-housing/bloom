#!/bin/bash

REPO_NAME="${1}"
SRC_TAG="${2}"
DEST_TAG="${3}"

echo "Pulling image manifest for [${REPO_NAME}:${SRC_TAG}]"

MANIFEST=$(aws ecr batch-get-image --repository-name "${REPO_NAME}" --image-ids imageTag="${SRC_TAG}" --output json | jq --raw-output --join-output '.images[0].imageManifest')

# The image has to have this tag or else we can't do anything
if [[ -z "${MANIFEST}" ]]; then
    echo "No matching image found for repo [${REPO_NAME}] and tag [${SRC_TAG}]"
    exit 1
fi

echo "Manifest found"
echo "Adding tag [${DEST_TAG}] to [${REPO_NAME}:${SRC_TAG}]"

aws ecr put-image --repository-name "${REPO_NAME}" --image-tag "${DEST_TAG}" --image-manifest "$MANIFEST"


