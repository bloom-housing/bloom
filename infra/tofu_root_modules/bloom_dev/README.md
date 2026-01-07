# bloom-dev AWS account

This root module configures the bloom-dev AWS account.

- Partners site: https://partners.core-dev.bloomhousing.dev
- Public site: https://core-dev.bloomhousing.dev

## First apply

The AWS certificate needs to be created and validated before the rest of the Bloom deployment can be
applied. So, when applying to a fresh account, run:

1. `tofu apply -exclude=module.bloom_deployment`
2. `tofu apply`

See the instructions in [Apply Bloom Deployment OpenTofu
Modules](../../aws_deployment_guide/6_apply_bloom_deployment_tofu_modules.md) for full instructions.
