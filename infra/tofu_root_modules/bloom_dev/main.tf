terraform {
  required_providers {
    aws = {
      version = "6.16.0"
      source  = "hashicorp/aws"
    }
  }
  backend "s3" {
    region       = local.aws_region
    profile      = local.sso_profile_id
    bucket       = "bloom-dev-tofu-state"
    key          = "state"
    use_lockfile = true
  }
}

locals {
  aws_region          = "us-west-2"
  sso_profile_id      = "bloom-dev-deployer"
  deletion_protection = false
}

provider "aws" {
  profile = local.sso_profile_id
  region  = local.aws_region
}

# Create a bucket for this module's tofu state. See the README.md for more details about how this
# works for the first apply of the module.
resource "aws_s3_bucket" "tofu_state" {
  region        = local.aws_region
  bucket        = "bloom-dev-tofu-state"
  force_destroy = !local.deletion_protection
}
# https://opentofu.org/docs/v1.11/language/settings/backends/s3/:
# "It is highly recommended that you enable Bucket Versioning"
resource "aws_s3_bucket_versioning" "tofu_state" {
  bucket = aws_s3_bucket.tofu_state.id
  versioning_configuration {
    status = "Enabled"
  }
}

module "bloom-dev" {
  source             = "../../tofu_importable_modules/bloom_deployment"
  env_type           = "dev"
  aws_account_number = 242477209009
  aws_region         = local.aws_region
}
