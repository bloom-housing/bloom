# Bloom Infrastructure

This directory contains infrastructure-as-code configuration for the Bloom Core AWS deployments. It
uses OpenTofu: https://opentofu.org/, a drop-in replacement for Terraform that is maintained by the
Cloud Native Computing Foundation.

- For instructions on deploying Bloom to an AWS organization, see
  [./aws_deployment_guide/0_README.md](./aws_deployment_guide/0_README.md).
- For instructions on developing the OpenTofu modules, see [./DEVELOPMENT.md](./DEVELOPMENT.md).

## Structure

**Maintained in Bloom core repo, synced to forks:**

- [tofu_importable_modules](./tofu_importable_modules): Contains all the OpenTofu importable
  modules. An importable module is a reusable set of resources configured through input
  parameters. Root modules import importable modules.

   - [bloom_deployer_permission_set_policy](./tofu_importable_modules/bloom_deployer_permission_set_policy/):
     Configures an inline permission set policy with the required permissions to deploy Bloom.
   - [bloom_deployment](./tofu_importable_modules/bloom_deployment/): Configures all the resources
     needed for a Bloom deployment in a single AWS account.

**Maintained in forks:**

- [tofu_root_modules](./tofu_root_modules): Contains all the OpenTofu root modules. A root module
  is a set of resources that are all managed together. Each root module has a state file that
  records the results of the latest apply operation. See
  https://github.com/bloom-housing/bloom-exygy/tree/main/infra/tofu_root_modules for an example root
  module structure.

## Infrastructure-as-code mental model

Let's say that you need to deploy Bloom to an AWS account. A straight-forward way of achieving this
would be to log into the AWS web console and create all the required resources. The downside of this
approach is that unless you take really good notes, it is a difficult process to replicate.

Another approach could be to write a bash script that calls a bunch of AWS CLI commands that create
the resources. This improves on the web-based approach because all the steps are explicitly written
down. However, the script only works on a fresh AWS account - if you run it again there will be
a bunch of errors because the resources will have already been created. If you need to change how
the account is configured, you need to write more scripts.

Enter infrastructure-as-code tools like Terraform and OpenTofu. I like to think of them as CLI
scripting with a bunch of functionality already built in. `.tf` files contain [resource
descriptions](https://opentofu.org/docs/language/resources/). Run the 'script' by running [`tofu
apply`](https://opentofu.org/docs/cli/commands/apply/). If the AWS account already matches the
desired configuration, Tofu prints a nice message that the infrastructure matches the
configuration. Otherwise, Tofu presents a list of planned changes it wants to make and asks if it
should go forward with the plan.

It is still possible to misconfigure resources and get errors from the AWS API. These cases are not
always handled gracefully and sometimes require deleting or configuring things manually to unblock
the tool. Using a infrastructure-as-code still requires manual testing and knowledge of the
underlying systems you are configuring. It is a heck of a lot better than shell scripting, however,
at least in my experience :)
