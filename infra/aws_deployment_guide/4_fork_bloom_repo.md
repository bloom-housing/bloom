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
   repo. If choosing GitHub, **note the GitHub org or account name** your fork will exist in.
3. Pick **and note a AWS region to deploy Bloom to**.
4. Pick **and note DNS domains for the dev and prod Bloom deployments**. You must be able to add
   CNAME records for the chosen domains.
5. Pick **and note a Jurisdiction name** for your Bloom deployment.

## Steps

1. Fork https://github.com/bloom-housing/bloom. Go the 'Actions' tab and click the 'I understand my
   workflows, go ahead and enable them' button.

2. Click on the 'Docker Image Build' action. Select the 'Run workflow' dropdown and then click the
   'Run workflow' button. The workflow will build and push images to GitHub container registry. Wait
   for the action to succeed.

3. **Note the infra-dev docker image tag that was built in step 2**:

   In the 'Docker Build summary' section for the 'infra-dev' container, expand the 'Build inputs'
   section. The container image is listed in the 'tags:' section.

   For example:
   'ghcr.io/avrittrohwer/bloom/infra-dev:gitsha-a800b89442e5ac45ab73dcd8d6319378a1e44b95'.

4. Clone the Bloom fork to a host that has docker or podman installed.

5. Initialize root modules using a helper script. All argument values should be present in your
   notes. To see all required arguments, run:

   ```bash
   INFRA_DEV_CONTAINER=<from your notes in step 3>
   docker run --rm -it --entrypoint python3 --user "$(id -u):$(id -g)" -v ./infra:/bloom/infra:z "${INFRA_DEV_CONTAINER:?}" /bloom/infra/root_module_initializer.py -h
   ```

   If using podman instead of docker, replace `--user "$(id -u):$(id -g)"` with `--userns=keep-id`.

   Run the command with all arguments specified. It will write files:

   - infra/aws_sso_config
   - infra/tofu_root_modules/bloom_dev/main.tf
   - infra/tofu_root_modules/bloom_dev_deployer_permission_set_policy/main.tf
   - infra/tofu_root_modules/bloom_prod/main.tf
   - infra/tofu_root_modules/bloom_prod_deployer_permission_set_policy/main.tf

   To see the changes, stage the files with `git add .` then diff with `git diff --staged`.

6. Push the changes to your fork's main branch.

7. **Note the infra docker image tag and git commit sha that was built after the push in step 6**:

   1. On the 'Docker Image Build' action page for your fork
      (https://github.com/<YOUR_GITHUB_ORG>/bloom/actions/workflows/docker_image_build.yml), click
      on the workflow run that was triggered after the push in step 6.

   2. In the 'Docker Build summary' section for the 'infra' container (make sure to not select
      'infra-dev', 'infra' is a separate container), expand the 'Build inputs' section. The
      container image is listed in the 'tags:' section. The git commit sha is the suffix of the
      container image.

      For example, if the container image tag is
      'ghcr.io/avrittrohwer/bloom/infra:gitsha-a800b89442e5ac45ab73dcd8d6319378a1e44b95', the git
      commit sha is 'a800b89442e5ac45ab73dcd8d6319378a1e44b95'.

## After these steps

1. The main branch of your Bloom fork should be updated to have the details for your AWS accounts.
2. Your notes should have the infra docker container image tag and git sha that was built from the
   commit updating your fork.
