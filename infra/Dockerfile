# This file creates a docker image that contains the required binaries and source code to deploy
# Bloom root modules. It is meant to be used in deployment pipelines.

# Get OpenTofu binary following https://opentofu.org/docs/intro/install/docker/#method-1-using-a-multi-stage-build
#
# To update, find the latest stable version from:
# https://github.com/opentofu/opentofu/pkgs/container/opentofu/versions?tag=latest
#
# Use the `<version>-minimal` image. Explicitly pin the version tag and image sha.
#
# IMPORTANT: keep this in sync with ./Dockerfile.dev
FROM ghcr.io/opentofu/opentofu:1.10.7-minimal@sha256:e8b80de6a840eb0e19d82aecbdaa2e2718cb107d15dbe849e6b550955aceacd2 AS opentofu

# Use aws-cli image as the base image. It is built on amazonlinux base image.
#
# https://github.com/aws/aws-cli/blob/v2/docker/Dockerfile
# https://docs.aws.amazon.com/linux/al2023/ug/what-is-amazon-linux.html
#
# To update, find the latest stable version from:
# https://hub.docker.com/r/amazon/aws-cli/tags
#
# Explicitly pin the version tag and image sha.
#
# IMPORTANT: keep this in sync with ./Dockerfile.dev
FROM docker.io/amazon/aws-cli:2.32.9@sha256:734684f3fc98bbac0e7796c34f44c375c01f05febac52a10649a55eef1e96c24

# Copy over the tofu binary.
COPY --from=opentofu /usr/local/bin/tofu /usr/local/bin/tofu

# Install other required binaries.
RUN <<EOF
dnf update -y
dnf install -y shadow-utils # make groupadd and useradd available.
dnf install -y openssl
dnf clean all # clean the dnf cache from the final image.
EOF

# Create a non-root user to run (principle of least privilege).
WORKDIR /bloom
RUN groupadd --gid 2002 bloom && useradd --gid 2002 --uid 2002 --home /bloom bloom
RUN chown --recursive 2002:2002 /bloom
USER 2002:2002

# Configure Tofu to use a share provider cache:
# https://opentofu.org/docs/cli/config/config-file/#provider-plugin-cache.
#
# If this is not set up, the AWS provider will be duplicated in every root module's .terraform
# directory. The AWS provider is a little under 1 GiB so sharing reduces this image size by
# a significant amount.
RUN <<EOF
mkdir /bloom/.terraform-plugin-cache
echo 'plugin_cache_dir = "/bloom/.terraform-plugin-cache"' > /bloom/.tofurc
EOF

# Copy in the tofu modules and initialize the provider dependencies for the root modules.
COPY --chown=2002:2002 tofu_importable_modules /bloom/tofu_importable_modules
COPY --chown=2002:2002 tofu_root_modules /bloom/tofu_root_modules

# Initialize all the root modules with -backend=false. This only downloads the tofu provider
# dependencies. Tofu init will still need to be called from within the container, at which point the
# state file in the S3 bucket will be read.
WORKDIR /bloom/tofu_root_modules
RUN <<EOF
for d in ./*; do
    cd "$d"
    tofu init -backend=false
    cd ..
done
EOF

# Copy in the AWS SSO CLI config.
COPY --chown=2002:2002 aws_sso_config /bloom/.aws/config

# Copy in the python entrypoint.
WORKDIR /bloom
COPY --chown=2002:2002 docker-entrypoint.py /bloom/docker-entrypoint.py

ENTRYPOINT [ "python3", "docker-entrypoint.py" ]
