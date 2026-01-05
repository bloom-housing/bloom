terraform {
  backend "s3" {
    profile      = local.sso_profile_id
    region       = local.tofu_state_bucket_region
    bucket       = local.tofu_state_bucket_name
    key          = "${local.tofu_state_key_prefix}/state"
    use_lockfile = true
  }
}

locals {
  bloom_deployment = "bloom-prod"
  sso_profile_id   = "${local.bloom_deployment}-iam-admin"

  tofu_state_bucket_region = "us-east-1"
  tofu_state_bucket_name   = "bloom-core-tofu-state-files"
  tofu_state_key_prefix    = "${local.bloom_deployment}-deployer-permissionset-policy"

  iam_identity_center_region       = "us-east-1"
  iam_identity_center_instance_arn = "arn:aws:sso:::instance/ssoins-72233fa322bcade3"
  deployer_permission_set_arn      = "arn:aws:sso:::permissionSet/ssoins-72233fa322bcade3/ps-7223d37ee367da27"

  bloom_deployment_aws_account_number     = "966936071156"
  bloom_deployment_aws_region             = "us-west-1"
  bloom_deployment_tofu_state_bucket_name = local.tofu_state_bucket_name
  bloom_deployment_tofu_state_file_prefix = local.bloom_deployment
}

provider "aws" {
  profile = local.sso_profile_id
  region  = local.iam_identity_center_region
}

module "deployer_permission_set" {
  source = "../../tofu_importable_modules/bloom_deployer_permission_set_policy"

  iam_identity_center_instance_arn = local.iam_identity_center_instance_arn
  permission_set_arn               = local.deployer_permission_set_arn

  bloom_deployment_aws_account_number     = local.bloom_deployment_aws_account_number
  bloom_deployment_aws_region             = local.bloom_deployment_aws_region
  bloom_deployment_tofu_state_bucket_name = local.bloom_deployment_tofu_state_bucket_name
  bloom_deployment_tofu_state_file_prefix = local.bloom_deployment_tofu_state_file_prefix
}
