terraform {
  backend "s3" {
    region       = local.iam_identity_center_region
    profile      = local.sso_profile_id
    bucket       = local.tofu_state_bucket_name
    key          = "${local.permission_set_name}-permissionset-policy/state"
    use_lockfile = true
  }
}

locals {
  tofu_state_bucket_name = "bloom-core-tofu-state-files"
  sso_profile_id         = "bloom-dev-iam-admin"

  iam_identity_center_region       = "us-east-1"
  iam_identity_center_instance_arn = "arn:aws:sso:::instance/ssoins-72233fa322bcade3"

  permission_set_name              = "bloom-dev-deployer"
  permission_set_arn               = "arn:aws:sso:::permissionSet/ssoins-72233fa322bcade3/ps-72232137320b912d"

  # Config for the bloom deployment this permission set policy allows to deploy.
  bloom_deployment_name                   = "bloom-dev"
  bloom_deployment_aws_account_number     = "242477209009"
  bloom_deployment_aws_region             = "us-west-2"
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
