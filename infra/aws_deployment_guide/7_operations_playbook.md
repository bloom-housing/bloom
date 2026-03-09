# Operations Playbook

This directory contains instructions for deploying Bloom dev and prod environments to an AWS
organization. The guide is broken down into a series of files that should be followed in order:

1. [Create AWS Accounts](./1_create_aws_accounts.md)
2. [IAM Identity Center Configuration](./2_iam_identity_center_configuration.md)
3. [Create Tofu State S3 Bucket](./3_create_tofu_state_s3_bucket.md)
4. [Fork the Bloom Repo](./4_fork_bloom_repo.md)
5. [Apply Deployer Permission Set Tofu Modules](./5_apply_deployer_permission_set_tofu_modules.md)
6. [Apply Bloom Deployment Tofu Modules](./6_apply_bloom_deployment_tofu_modules.md)
7. [Operations Playbook](./7_operations_playbook.md) (you are here)

This file contains instructions for common operational tasks performed while maintaining a Bloom
deployment.

## Required permissions

1. Be a member of the `bloom-dev-deployers` group if operating on the dev environment.
2. Be a member of the `bloom-prod-deployers` group if operating on the prod environment.

## Before these steps

1. Complete the steps in [Apply Bloom Deployment Tofu
   Modules](./6_apply_bloom_deployment_tofu_modules.md).
2. Complete the steps in [Creating a Cloudshell
   Environment](#creating-a-cloudshell-environment). All bash code blocks in this file are expected
   to succeed when run in a configured Cloudshell environment.

## Creating a Cloudshell Environment

After logging into an AWS account with Bloom deployed, users of the AWS web console can create
a Cloudshell environment that has access to the Bloom VPC. Follow the steps in
https://docs.aws.amazon.com/cloudshell/latest/userguide/creating-vpc-environment.html:

- Give it a descriptive name like 'bloom'.
- Select the VPC with the tag 'bloom'.
- Select any private subnet.
- Select the Security Group with the tag 'bloom-cloudshell'.

## Manually accessing the Bloom database

Go to the 'Aurora and RDS > Databases > bloom' page in the AWS web console. **Note the instance
Endpoint.** If viewing the 'Connecting using > Code snippets' section, you can copy the example
line from it to your Cloudshell:

```bash
export RDSHOST="bloom.exampleid.us-west-2.rds.amazonaws.com"
```

Set the `PGHOST` environment variable to be the instance endpoint, generate an
auth token for the bloom_readonly database user, and connect using psql:

```bash
export PGHOST=$RDSHOST
PGPASSWORD=$(aws rds generate-db-auth-token --hostname "$PGHOST" --port 5432 --username bloom_readonly) psql --username bloom_readonly --dbname bloom_prisma
```

To view the list of tables, run:

```psql
bloom_prisma=> \dt
```

## Manually accessing the Bloom API

Find the IP addresses of the Bloom API tasks:

```bash
aws servicediscovery discover-instances \
--namespace-name bloom --service-name bloom-api \
--query 'Instances[*].Attributes.AWS_INSTANCE_IPV4'
export BLOOM_API=<one of the IP addresses>
```

Use curl to send requests to API endpoints. The root URL is the healthcheck endpoint:

```bash
curl --connect-timeout 3 "http://${BLOOM_API}:3100"
```

The API endpoint is documented at:

1.  The API spec for the https://github.com/bloom-housing/bloom main branch is at
    https://bloom-backend-main.herokuapp.com/api.
2. Get the schema data directly from the Bloom API:

   ```bash
   curl --connect-timeout 3 "http://${BLOOM_API}:3100/api/swagger-ui-init.js"
   ```
3. Read the `export class RootService {` in `/shared-helpers/src/types/backend-swagger.ts` file on the Git commit of the deployed
   Bloom API ECS task.

