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
