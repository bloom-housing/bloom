# Bloom Infrastructure

This directory contains infrastructure-as-code configuration for the Bloom Core AWS deployments.

## Tools used

- Open Tofu: https://opentofu.org/. Open-Source drop-in replacement for Terraform that is maintained
  by the Cloud Native Computing Foundation.

## Structure

- [tofu_root_modules](./tofu_root_modules): Contains all the Open Tofu root modules. A root module
  is a set of resources that are all managed together. Each root module has a state file that
  records the results of the last-run apply operation.

   - [bloom_dev_deployer_permission_set](./tofu_root_modules/bloom_dev_deployer_permission_set/README.md):
     Configures the bloom-dev-deployer permission set that is assigned on the bloom-dev account.

## Manual AWS setup

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
           "arn:aws:sso:::permissionSet/ssoins-72233fa322bcade3/ps-06b1fe8280547b14",
           "arn:aws:sso:::instance/ssoins-72233fa322bcade3"
         ]
       }
     ]
   }
   ```
6. `bloom-dev-deployer-tofu-state` S3 bucket in the organization management account.
