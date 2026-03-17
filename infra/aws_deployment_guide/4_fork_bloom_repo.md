# Fork the Bloom Repo

This directory contains instructions for deploying Bloom dev and prod environments to an AWS
organization. The guide is broken down into a series of files that should be followed in order:

1. [Create AWS Accounts](./1_create_aws_accounts.md)
2. [IAM Identity Center Configuration](./2_iam_identity_center_configuration.md)
3. [Create Tofu State S3 Bucket](./3_create_tofu_state_s3_bucket.md)
4. [Fork the Bloom Repo](./4_fork_bloom_repo.md) (you are here)
5. [Apply Deployer Permission Set Tofu Modules](./5_apply_deployer_permission_set_tofu_modules.md)
6. [Apply Bloom Deployment Tofu Modules](./6_apply_bloom_deployment_tofu_modules.md)
7. [Operations Playbook](./7_operations_playbook.md)

## Required permissions

1. Create a fork of the https://github.com/bloom-housing/bloom repository in your GitHub
   organization or personal account.
2. Clone your fork to a host that has docker (or podman) and git installed.

## Before these steps

1. Complete the steps in [Create Tofu State S3 Bucket](./3_create_tofu_state_s3_bucket.md). The
   following notes from previous steps will be needed:
   1. AWS account numbers for the dev and prod Bloom accounts.
   2. S3 bucket name and region for the OpenTofu state file bucket.
   3. IAM Identity Center Instance ARN, region, and AWS access portal URL.
   4. Permission set ARNs for `bloom-dev-deployer` and `bloom-prod-deployer`.
2. Decide where you would like to host your Bloom fork. GitHub will work out-of-the-box. If choosing
   another provider, you will need to bring your own method for building docker images from the
   repo.
3. Pick an AWS region to deploy Bloom to.
4. Pick DNS domains for the dev and prod Bloom deployments. You must be able to add CNAME records
   for the chosen domains.

## Steps

1. Fork https://github.com/bloom-housing/bloom. After forking, GitHub should trigger the 'Docker
   Image Build' action:
   https://github.com/<YOUR_GITHUB_ORG>/bloom/actions/workflows/docker_image_build.yml. It will
   build and push Bloom docker images to the GitHub container registry in your GitHub
   organization. Wait for the action to succeed.

2. Clone the Bloom fork to a host that has docker or podman installed.

3. Get the docker image for your fork's infra-dev container:
   1. Go to your GitHub Organization's Packages page:
      https://github.com/orgs/<YOUR_GITHUB_ORG>/packages.
   2. Click on the 'infra-dev' container and **note the container name and the git commit it was
      built from**. For example, if the container name is
      'ghcr.io/bloom-housing/bloom/infra-dev:gitsha-ad3fca97bd5520dba05a0907f7c907f4984e8680', the
      git SHA that it was built from is 'ad3fca97bd5520dba05a0907f7c907f4984e8680'.

4. Initialize root modules using a helper script. All arguments should be present in your notes. To see all required parameters, run:

   ```bash
   docker run --rm -it --entrypoint python3 --user "$(id -u):$(id -g)" -v ./infra:/infra:z ghcr.io/<YOUR_GITHUB_ORG>/bloom/infra-dev:gitsha-SOMESHA /infra/root_module_initializer.py -h
   ```

   If using podman instead of docker, replace `--user "$(id -u):$(id -g)"` with `--userns=keep-id`.

   Run the command with all arguments specified. It will write files:

   - infra/aws_sso_config
   - infra/tofu_root_modules/bloom_dev/main.tf
   - infra/tofu_root_modules/bloom_dev_deployer_permission_set_policy/main.tf
   - infra/tofu_root_modules/bloom_prod/main.tf
   - infra/tofu_root_modules/bloom_prod_deployer_permission_set_policy/main.tf

   To see the changes, stage the files with `git add .` then diff with `git diff --staged`.

5. Push the changes to your fork's main branch.

6. Get the docker image for your fork's infra container. After pushing the infra updates, GitHub
   should trigger the 'Docker Image Build' action again. Go to your GitHub Organization's Packages
   page: https://github.com/orgs/<YOUR_GITHUB_ORG>/packages.
   1. Click on the 'infra' container and **note the container name that corresponds to the git
      commit SHA of your infra updates commit**. It must be the infra container version that was
      built on or after the commit updating your fork's infra/ directory. If you use an infra
      container version that was built from a commit before your fork was updated, it will fail
      because it will not have the root modules you initialized in step 4.

## After these steps

1. The main branch of your Bloom fork should be updated to have the details for your AWS accounts.
2. Your notes should have the infra docker container image version that was built from the commit
   updating your fork.
