# Fork the Bloom Repo

This directory contains instructions for deploying Bloom dev and prod environments to an AWS
organization. The guide is broken down into a series of files that should be followed in order:

1. [Create AWS Accounts](./1_create_aws_accounts.md)
2. [IAM Identity Center Configuration](./2_iam_identity_center_configuration.md)
3. [Create Tofu State S3 Bucket](./3_create_tofu_state_s3_bucket.md)
4. [Fork the Bloom Repo](./4_fork_bloom_repo.md) (you are here)
5. [Apply Deployer Permission Set Tofu Modules](./5_apply_deployer_permission_set_tofu_modules.md)
6. [Apply Bloom Deployment Tofu Modules](./6_apply_bloom_deployment_tofu_modules.md)

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
3. Pick an AWS region to deploy dev and prod Bloom to.
4. Pick DNS domains for the dev and prod Bloom deployments. You must be able to add CNAME records
   for the chosen domains.

## Steps

1. Fork https://github.com/bloom-housing/bloom. After forking, GitHub should
   trigger the 'Docker Image Build' action:
   https://github.com/<YOUR_GITHUB_ORG>/bloom/actions/workflows/docker_image_build.yml. It will
   build and push Bloom docker images to the GitHub container registry in your GitHub organization.
2. Get the docker images for your fork's Bloom services. Go to your GitHub Organization's Packages
   page: https://github.com/orgs/<YOUR_GITHUB_ORG>/packages.

   1. Click on the 'api' container and **note the container name**.
   2. Click on the 'partners' container and **note the container name**.
   3. Click on the 'public' container and **note the container name**.

3. Update your fork's infra/ directory:
   1. Update the details in `infra/aws_sso_config` for your organization's IAM Identity Center and
      account numbers.
   2. Update `infra/tofu_root_modules/bloom_dev_deployer_permission_set_policy/main.tf` with details
      for your dev deployment:

      In the `locals {` block, update variables:
      1. `tofu_state_bucket_region`
      2. `tofu_state_bucket_name`
      3. `iam_identity_center_region`
      4. `iam_identity_center_instance_arn`.
      5. `deployer_permission_set_arn`, ensure this is the bloom-dev-deployer permission set ARN.
      6. `bloom_deployment_aws_account_number`, ensure this is the dev account number
      7. `bloom_deployment_aws_region`.

   3. Update `infra/tofu_root_modules/bloom_prod_deployer_permission_set_policy/main.tf` with
      details for your prod deployment:

      In the `locals {` block, update variables:
      1. `tofu_state_bucket_region`
      2. `tofu_state_bucket_name`
      3. `iam_identity_center_region`
      4. `iam_identity_center_instance_arn`
      5. `deployer_permission_set_arn`, ensure this is the bloom-prod-deployer permission set ARN.
      6. `bloom_deployment_aws_account_number`, ensure this is the prod account number.
      7. `bloom_deployment_aws_region`

   4. Update `infra/tofu_root_modules/bloom_dev/main.tf` with details for your dev deployment:

      In the `locals {` block, update variables:
      1. `tofu_state_bucket_region`
      2. `tofu_state_bucket_name`
      3. `bloom_aws_account_number`, ensure this is the dev account number.
      4. `bloom_aws_region`
      5. `domain_name`, ensure this is the dev domain.

      In the `module "bloom_deployment"` block, update variables:
      1. `bloom_api_image`
      2. `bloom_site_partners_image`
      3. `bloom_site_public_image`
      4. `bloom_site_public_env_vars`

   5. Update `infra/tofu_root_modules/bloom_prod/main.tf` with details for your prod deployment:

      In the `locals {` block, update variables:
      1. `tofu_state_bucket_region`
      2. `tofu_state_bucket_name`
      3. `bloom_aws_account_number`, ensure this is the prod account number.
      4. `bloom_aws_region`
      5. `domain_name`, ensure this is the prod domain.

      In the `module "bloom_deployment"` block, update variables:
      1. `bloom_api_image`
      2. `bloom_site_partners_image`
      3. `bloom_site_public_image`
      4. `bloom_site_public_env_vars`

   6. Push the changes to your fork's main branch.

4. Get the docker image for your fork's infra container. After pushing the infra updates, GitHub
   should trigger the 'Docker Image Build' action again. Go to your GitHub Organization's Packages
   page: https://github.com/orgs/<YOUR_GITHUB_ORG>/packages.
   1. Click on the 'infra' container and **note the container name that corresponds to the git
      commit SHA of your infra updates commit**. It must be the infra container version that was
      build on or after the commit updating your forks infra/ directory. If you use an infra
      container version that was build from a commit before your fork was updated, it will attempt
      to deploy the Bloom Core infra/ config.

## After these steps

1. The main branch of your Bloom fork should be updated to have the details for your AWS deployments
   and not the Bloom Core AWS deployment.
2. Your notes should have the infra docker container image version that was build from the commit
   updating your fork.
