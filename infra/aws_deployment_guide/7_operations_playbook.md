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

## Creating a Cloudshell

## Manually accessing the Bloom database

```
PGHOST=
PGPASSWORD=$(aws rds generate-db-auth-token --hostname "$PGHOST" --port 5432 --username bloom_api) psql --username bloom_api --dbname bloom_prisma
```


## Manually accessing the Bloom API
