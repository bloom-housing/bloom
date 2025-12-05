terraform {
  backend "s3" {
    profile      = local.sso_profile_id
    region       = local.tofu_state_bucket_region
    bucket       = local.tofu_state_bucket_name
    key          = local.tofu_state_key_prefix
    use_lockfile = true
  }
}

locals {
  sso_profile_id = "bloom-prodlike-iam-admin"

  tofu_state_bucket_region = "us-east-1"
  tofu_state_bucket_name   = "bloom-core-tofu-state-files"
  tofu_state_key_prefix    = "bloom-prodlike-deployer-permissionset-policy/state"

  iam_identity_center_region       = "us-east-1"
  iam_identity_center_instance_arn = "arn:aws:sso:::instance/ssoins-72233fa322bcade3"
  permission_set_arn               = "arn:aws:sso:::permissionSet/ssoins-72233fa322bcade3/ps-72231deca4c59785"

  # Config for the bloom deployment this permission set policy allows to deploy.
  bloom_deployment_name                   = "bloom-prodlike"
  bloom_deployment_aws_account_number     = "966936071156"
  bloom_deployment_aws_region             = "us-west-1"
  bloom_deployment_tofu_state_bucket_name = local.tofu_state_bucket_name
  bloom_deployment_tofu_state_file_prefix = local.bloom_deployment_name
}

provider "aws" {
  profile = local.sso_profile_id
  region  = local.iam_identity_center_region
}

module "deployer_permission_set" {
  source = "../../tofu_importable_modules/bloom_deployer_permission_set_policy"

  iam_identity_center_instance_arn = local.iam_identity_center_instance_arn
  permission_set_arn               = local.permission_set_arn

  bloom_deployment_aws_account_number     = local.bloom_deployment_aws_account_number
  bloom_deployment_aws_region             = local.bloom_deployment_aws_region
  bloom_deployment_tofu_state_bucket_name = local.bloom_deployment_tofu_state_bucket_name
  bloom_deployment_tofu_state_file_prefix = local.bloom_deployment_tofu_state_file_prefix
}
