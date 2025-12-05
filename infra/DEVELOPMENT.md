# Infrastructure Development

## Required environment

A unix-like environment with the following binaries installed is required:

1. bash: https://www.gnu.org/software/bash/bash.html
2. openssl: https://github.com/openssl/openssl
3. tr: https://man7.org/linux/man-pages/man1/tr.1.html
4. Open Tofu: https://opentofu.org/docs/intro/install/
5. AWS CLI: https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html

   The following `~/.aws/config` file is required for working with the Bloom Core AWS accounts:

   ```
   [profile bloom-dev-deployer]
   sso_session = sso
   sso_account_id = 242477209009
   sso_role_name = bloom-dev-deployer
   region = us-east-1

   [profile bloom-dev-iam-admin]
   sso_session = sso
   sso_account_id = 098472360576
   sso_role_name = bloom-dev-iam-admin
   region = us-east-1

   [sso-session sso]
   sso_start_url = https://d-9067ac8222.awsapps.com/start
   sso_region = us-east-1
   sso_registration_scopes = sso:account:access
   ```

## Testing changes in the bloom-dev account:

1. Open a shell and change directory to the bloom_dev root module:

   ```bash
   cd infra/tofu_root_modules/bloom_dev
   ```

2. Authenticate to AWS:

   ```bash
   aws sso login --profile bloom-dev-deployer
   ```

3. Edit the `.tf` files.
4. Run `tofu apply` and review the planned changes. If there are unexpected planned changes, go back
   to step 3. If all the changes are expected, approve the apply.
5. If the apply fails because of permission issues, update the permissions in the [deployer
   importable module](./tofu_importable_modules/bloom_deployer_permission_set_policy/main.tf), then
   update the bloom-dev-deployer permission set policy (see section below), then retry step 4.
6. Inspect the relevant AWS resources via the CLI or the AWS web console (Log in via
   https://d-9067ac8222.awsapps.com/start). If there are unexpected results, go back to step 3. In
   some cases you may have to manually modify or delete resources directly to 'unstick' Open Tofu.
7. Test the deletion path for resources provisioned by the bloom_deployment importable module:

   ```bash
   tofu destroy -target=module.bloom_deployment
   ```

## Updating the bloom-dev-deployer permission set policy

1. Open a shell and change directory to the bloom_dev_deployer_permission_set_policy root module:

   ```bash
   cd infra/tofu_root_modules/bloom_dev_deployer_permission_set_policy
   ```

2. Authenticate to AWS:

   ```bash
   aws sso login --profile bloom-dev-iam-admin
   ```

3. Edit the `.tf` files.
4. Run `tofu apply` and review the planned changes. If there are unexpected planned changes, go back
   to step 3. If all the changes are expected, approve the apply.

## Working with root modules

### Downloading provider dependencies

To work with root modules on your local machine, open a shell and change directory to the root
module directory:

```bash
cd infra/tofu_root_modules/ROOT_MODULE
```

Open Tofu relies on provider dependencies being present locally in the
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
in the root module directory.


### Forcing resource recreation

To force Tofu to replace a resource, run `tofu apply -replace=ADDRESS`. For example:

```
tofu apply -replace=module.bloom_deployment.aws_secretsmanager_secret.api_jwt_signing_key
```

This is helpful when testing the local-exec provisioner because the provisioner only runs on
resource creation.
