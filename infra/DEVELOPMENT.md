# Infrastructure Development

## Required environment

1. bash: https://www.gnu.org/software/bash/bash.html
2. openssl: https://github.com/openssl/openssl
3. tr: https://man7.org/linux/man-pages/man1/tr.1.html
4. OpenTofu: https://opentofu.org/docs/intro/install/
5. AWS CLI: https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html

### Infra-dev docker container

[./Dockerfile.dev](./Dockerfile.dev) builds a container image with the required binaries. Run the
container with `docker container run` or `podman container run`. The infra-dev container does not
include the infra source code in its root filesystem - clone the Bloom repo on your host and give
the container access through volume mounts:

1. `-v ./infra:/infra:z` makes the infra directory available to the container.
2. `-v "${HOME}/.aws/cli":/home/.aws/cli:z` makes the AWS cli directory available to the
   container. This is required for successful use of aws CLI calls in local-exec resource
   provisioners.
3. `-v "${HOME}/.aws/sso/cache":/home/.aws/sso/cache:z` makes the AWS SSO cache available to the
   container. This volume mount is not required for the container to run, however you will need to
   go through the SSO flow on every run if not provided.

Because the source code on the host filesystem has file ownership to the user running the docker
container, specifying the user the container process will run as is also necessary:

1. If using docker: `--user "$(id -u):$(id -g)"`
2. If using podman: `--userns=keep-id`

The container runs [./docker-entrypoint.py](./docker-entrypoint.py). The first argument is a root
module name in [./tofu_root_modules](./tofu_root_modules). The rest of the arguments are passed
directly to the OpenTofu binary. Because OpenTofu requires user input to approve apply operations,
use the `-it` flag when running the infra-dev container.

Before running OpenTofu with the passed in args, the script automatically:

1. Runs `aws sso login` on the correct profile for the selected root module.

   `aws sso login` does not need to run every time because the credentials are cached in
   `$HOME/.aws/sso/cache/`. Once the SSO credentials expire, you will need to go through the SSO
   flow again. To skip the auto sso step, pass `--skip-sso` or `-ss`.

2. Runs `tofu init` on the selected root module.

   `tofu init` only needs to run when initially downloading the OpenTofu providers to your host's
   filesystem or when changing providers and/or their versions. To skip the auto init step, pass
   `--skip-init` or `-si`.

All together:

```bash
docker container run --rm -it \
--user "$(id -u):$(id -g)" \
-v ./infra:/infra:z \
-v "${HOME}/.aws/cli":/home/.aws/cli:z \
-v "${HOME}/.aws/sso/cache":/home/.aws/sso/cache:z \
ghcr.io/bloom-housing/bloom/infra-dev:gitbranch-main-latest \
[[--skip-sso] | [--skip-init]] <ROOT_MODULE_NAME> <OPEN_TOFU_ARGS>
```

You may find it convenient to add an alias. From the root of the Bloom repo:

```bash
alias bloomtofu="docker container run --rm -it --user $(id -u):$(id -g) -v ${PWD}/infra:/infra:z -v ${HOME}/.aws/cli:/home/.aws/cli:z -v ${HOME}/.aws/sso/cache:/home/.aws/sso/cache:z ghcr.io/bloom-housing/bloom/infra-dev:gitbranch-main-latest"

bloomtofu -ss -si bloom_dev apply
```

## Testing changes in the bloom-dev account:

1. Edit the `.tf` files.
2. Run `tofu apply` on the `bloom_dev` root module and review the planned changes. If there are
   unexpected planned changes, go back to step 1. If all the changes are expected, approve the
   apply.
3. If the apply fails because of permission issues, update the permissions in the [deployer
   importable module](./tofu_importable_modules/bloom_deployer_permission_set_policy/main.tf), then
   update the `bloom_dev_deployer_permission_set_policy` root module, then retry step 2.
4. Inspect the relevant AWS resources via the CLI or the AWS web console (Log in via
   https://d-9067ac8222.awsapps.com/start). If there are unexpected results, go back to step 1. In
   some cases you may have to manually modify or delete resources directly to 'unstick' OpenTofu.
5. Test the deletion path for resources provisioned by the deployer importable module:

   ```bash
   tofu destroy -target=module.bloom_deployment
   ```

## Working with root modules

### Downloading provider dependencies

OpenTofu relies on provider dependencies being present locally in the
`.terraform` directory in the root module directory. To download the dependencies, run:

```bash
tofu init
```

Once the provider dependences have been downloaded, you will not have to run `tofu init` again
unless you add a provider.

To update a required version for a provider, change the version then run:

```bash
tofu init -upgrade
```

Both of these commands will download the new dependencies and update the `.terraform.lock.hcl` file
in the root module directory. Whenever updating the `.terraform.lock.hcl` file in a PR, lock the hashes for
all platforms:

```bash
tofu providers lock -platform=linux_amd64 -platform=linux_arm64 -platform=darwin_amd64 -platform=darwin_arm64
```

This ensures that developers on other platforms will not get `.terraform.lock.hcl` diffs after
downloading the updated providers from your PR.

### Forcing resource recreation

To force Tofu to replace a resource, run `tofu apply -replace=ADDRESS`. For example:

```
tofu apply -replace=module.bloom_deployment.aws_secretsmanager_secret.api_jwt_signing_key
```

This is helpful when testing the local-exec provisioner because the provisioner only runs on
resource creation.
