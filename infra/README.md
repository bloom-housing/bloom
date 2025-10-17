# Bloom Infrastructure

This directory contains infrastructure-as-code configuration for the Bloom Core AWS deployments. We
use Open Tofu: https://opentofu.org/, a drop-in replacement for Terraform that is maintained by the
Cloud Native Computing Foundation.

## Structure

- [tofu_root_modules](./tofu_root_modules): Contains all the Open Tofu root modules. A root module
  is a set of resources that are all managed together. Each root module has a state file that
  records the results of the latest apply operation.

   - [bloom_dev_deployer_permission_set](./tofu_root_modules/bloom_dev_deployer_permission_set/README.md):
     Configures the bloom-dev-deployer permission set that is assigned on the bloom-dev account.

## Infrastructure-as-code mental model

Let's say that you need to deploy Bloom to an AWS account. A straight-forward way of achieving this
would be to log into the AWS web console and create all the required resources. The downside of this
approach is that unless you take really good notes, it is a difficult process to replicate. Even if
you take really good notes, the process might have a lot of steps which are all opportunities for
making mistakes. Additionally, it is not possible to automate such a process (well, maybe if you
have one of those neat AIs that can control your browser. But the AI could also make mistakes just
like a human).

Another approach could be to write a bash script that calls a bunch of AWS CLI commands that create
the resources. This improves on the web-based approach because all the steps are explicitly written
down. However, the script only works on a fresh AWS account - if you run it again there will be
a bunch of errors because the resources will have already been created. If you need to change how
the account is configured, you need to write more scripts. That reminds me too much of database
evolutions to seem like an good idea...

Enter infrastructure-as-code tools like Open Tofu. I like to think of them as CLI scripting with
a bunch of functionality already built in. We have `.tf` files that contain [resource
descriptions](https://opentofu.org/docs/language/resources/) for everything we want to configure. We
can run the 'script' by running [`tofu apply`](https://opentofu.org/docs/cli/commands/apply/). If
the AWS account already matches our desired configuration, Tofu gives us a nice message that the
infrastructure matches the configuration. Otherwise, Tofu presents us with a list of planned changes
it thinks it needs to make and asks if it should go forward with the plan.

These tools are not magic, however. It is still possible to misconfigure resources and get errors
from the AWS API. These cases are not always handled gracefully and sometimes require deleting or
configuring things manually to unbork the tool. Using a infrastructure-as-code still requires manual
testing and knowledge of the underlying systems you are configuring. It is a heck of a lot better
than shell scripting, however, at least in my experience :)

_Monologue by Avritt Rohwer_

## Developer setup

1. Install required tools:
   1. Open Tofu: https://opentofu.org/docs/intro/install/
   2. AWS CLI: https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html

      After installing, edit your `~/.aws/config` file for SSO authentication:

      ```
      # Only needed if applying changes to the bloom_dev root module.
      [profile bloom-dev-deployer]
      sso_session = sso
      sso_account_id = 242477209009
      sso_role_name = bloom-dev-deployer
      region = us-east-1

      # Only needed if applying changes to the bloom_dev_deployer_permission_set root module.
      [profile bloom-permission-set-editor]
      sso_session = sso
      sso_account_id = 098472360576
      sso_role_name = bloom-permission-set-editor
      region = us-east-1

      [sso-session sso]
      sso_start_url = https://d-9067ac8222.awsapps.com/start
      sso_region = us-east-1
      sso_registration_scopes = sso:account:access
      ```

## Working with root modules

### Downloading provider dependencies

To work with root modules on your local machine, open a shell and change directory to the root
module directory:

```bash
cd infra/tofu_root_modules/bloom_dev
```

Open Tofu relies on provider dependencies being present locally in the
`.terraform` directory in the root module directory. To download the dependencies, run:

```bash
tofu init
```

Once the provider dependences have been downloaded, you will not have to run `tofu init` again
unless you add a provider. In that case, run:

```bash
tofu init
```

To update a required version for a provider, change the version in the relevant `main.tf` file then
run:

```bash
tofu init -upgrade
```

Both of these command will download the new dependencies and update the `.terraform.lock.hcl` file in the root module
directory.

### Applying changes

1. Open a shell and change directory to the root module.
2. Run `aws sso login` to authenticate to AWS. After 1 hour, you will need to re-authenticate using
   the same command.
3. Edit the `main.tf` file to update the desired configuration.
4. Run `tofu apply` and review the planned changes. If there are unexpected planned changes, go back
   to step 1. If all the changes are expected, approve the apply.
5. Inspect the relevant AWS resources via the CLI or the AWS web console
   (Log in via https://d-9067ac8222.awsapps.com/start). If there are unexpected results, go back to
   step 1. In some cases you may have to manually modify or delete resources directly to 'unstick'
   Open Tofu.

## AWS setup done manually

1. Exygy AWS Organization with an IAM Identity Center instance in the organization management
   account.
2. IAM Identity Center User for each developer.
3. IAM Identity Center Groups:

   1. `bloom-dev-deployers` containing the identities that can deploy Bloom to the `bloom-dev` AWS
      account.

4. `bloom-dev` AWS account in the Exygy organization.
5. `bloom-permission-set-editor` IAM Identity Center Permission Set that is assigned on the
   `bloom-dev` AWS account to the `bloom-dev-deployers` group with the following inline policy:

   ```
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "StateBucket",
         "Effect": "Allow",
         "Action": [
           "s3:ListBucket"
         ],
         "Resource": [
           "arn:aws:s3:::bloom-dev-deployer-tofu-state"
         ]
       },
       {
         "Sid": "StateFiles",
         "Effect": "Allow",
         "Action": [
           "s3:GetObject",
           "s3:PutObject",
           "s3:DeleteObject"
         ],
         "Resource": [
           "arn:aws:s3:::bloom-dev-deployer-tofu-state/state",
           "arn:aws:s3:::bloom-dev-deployer-tofu-state/state.tflock"
         ]
       },
       {
         "Sid": "PermissionSet",
         "Effect": "Allow",
         "Action": [
           "sso:ListPermissionSetProvisioningStatus",
           "sso:DescribePermissionSet",
           "sso:DescribePermissionSetProvisioningStatus",
           "sso:GetInlinePolicyForPermissionSet",
           "sso:GetPermissionsBoundaryForPermissionSet",
           "sso:GetPermissionSet",
           "sso:PutInlinePolicyToPermissionSet",
           "sso:UpdatePermissionSet",
           "sso:DescribeInstance",
           "sso:CreatePermissionSet",
           "sso:ListTagsForResource",
           "sso:ProvisionPermissionSet"
         ],
         "Resource": [
           "arn:aws:sso:::account/242477209009",
           "arn:aws:sso:::instance/ssoins-72233fa322bcade3",
           "arn:aws:sso:::permissionSet/ssoins-72233fa322bcade3/ps-06b1fe8280547b14"
         ]
       }
     ]
   }
   ```
6. `bloom-dev-deployer-tofu-state` S3 bucket in the organization management account.
