# AWS Deployment Guide

This directory contains instructions for deploying Bloom an AWS organization. The guide is separated
into a series of files that should be followed in order:

1. [Create AWS Accounts](./1_create_aws_accounts.md)
2. [IAM Identity Center Configuration](./2_iam_identity_center_configuration.md)
3. [Create Tofu State S3 Bucket](./3_create_tofu_state_s3_bucket.md)
4. [Fork the Bloom Repo](./4_fork_bloom_repo.md)
5. [Apply Deployer Permission Set Tofu Modules](./5_apply_deployer_permission_set_tofu_modules.md)
6. [Apply Bloom Deployment Tofu Modules](./6_apply_bloom_deployment_tofu_modules.md)

This guide requires certain resource details and ARNs to be noted for future steps. The guide will
call-out specific values to copy into a notes doc with bolded instructions like **Note the ...**.

Each file in the guide includes the following sections:

1. Required permissions
2. Before these steps
3. Steps
4. After these steps
