# Apply Deployer Permission Set OpenTofu Modules

This directory contains instructions for deploying Bloom dev and prod environments to an AWS
organization. The guide is broken down into a series of files that should be followed in order:

1. [Create AWS Accounts](./1_create_aws_accounts.md)
2. [IAM Identity Center Configuration](./2_iam_identity_center_configuration.md)
3. [Create Tofu State S3 Bucket](./3_create_tofu_state_s3_bucket.md)
4. [Fork the Bloom Repo](./4_fork_bloom_repo.md)
5. [Apply Deployer Permission Set Tofu Modules](./5_apply_deployer_permission_set_tofu_modules.md)
   (you are here)
6. [Apply Bloom Deployment Tofu Modules](./6_apply_bloom_deployment_tofu_modules.md)

The steps in this file create the following resources:

```mermaid
---
config:
  theme: 'base'
---
%% Diagram created by prompting Claude Opus 4.1 and manually edited.

graph TB
  subgraph ORG[AWS Organization]
      direction TB

      subgraph MA[AWS Management Account]
          direction TB

          S3[Bloom Tofu State Files<br/>AWS S3 Bucket]

          subgraph IC[AWS IAM Identity Center]
              direction LR

              subgraph PS_DEV[bloom-dev-deployer<br/>Permission Set]
                DEV_POLICY[Inline Permission Policy]
              end
              subgraph PS_PROD[bloom-prod-deployer<br/>Permission Set]
                PROD_POLICY[Inline Permission Policy]
              end
          end

          DEV_POLICY-.->|OpenTofu State file stored in|S3
          PROD_POLICY-.->|OpenTofu State file stored in|S3
      end
  end

  subgraph LEGEND
      direction LR

      PREREQ[Pre-requisite]
      CREATED[Created by OpenTofu]

      PREREQ ~~~ CREATED
  end

  %% Invisible link to position legend at top
  LEGEND ~~~ ORG

  %% Green for Tofu created
  classDef tofu fill:#e8f5e9,stroke:#388e3c,stroke-width:2px
  %% Dashed border for prerequisites
  classDef prerequisite fill:#fff,stroke:#666,stroke-width:2px,stroke-dasharray: 5 5
  %% Legend container style
  classDef legendStyle fill:#fff,stroke:#333,stroke-width:1px

  %% Apply prerequisite style to org structure
  class ORG,MA,IC,PREREQ,S3,PS_DEV,PS_PROD prerequisite

  %% Apply legend style
  class LEGEND legendStyle

  %% Apply terraform style (green)
  class DEV_POLICY,PROD_POLICY,CREATED tofu
```

## Required permissions

1. Be a member of the `bloom-dev-deployers` (or `bloom-dev-iam-admins` if a separate group was
   created in [IAM Identity Center Configuration](./2_iam_identity_center_configuration.md) step 1).
2. Be a member of the `bloom-prod-iam-admins` group.

## Before these steps

1. Complete the steps in [Fork the Bloom Repo](./4_fork_bloom_repo.md). The infra container image
   name build from your fork will be needed.

## Steps

1. Apply the dev deployer OpenTofu root module:

   ```bash
   docker run --rm -it ghcr.io/<YOUR_GITHUB_ORG>/bloom/infra:gitsha-SOMESHA bloom_dev_deployer_permission_set_policy apply
   ```

2. Apply the prod deployer OpenTofu root module:

   ```bash
   docker run --rm -it ghcr.io/<YOUR_GITHUB_ORG>/bloom/infra:gitsha-SOMESHA bloom_prod_deployer_permission_set_policy apply
   ```

## After these steps

1. The `bloom-dev-deployer` permission set should have its Inline policy set.
2. The `bloom-prod-deployer` permission set should have its Inline policy set.
3. The Tofu State S3 bucket should have two folders, `bloom-dev-deployer-permissionset-policy` and
   `bloom-prod-deployer-permissionset-policy`.
