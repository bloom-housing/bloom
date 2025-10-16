terraform {
  required_providers {
    aws = {
      version = "6.16.0"
      source  = "hashicorp/aws"
    }
  }
  backend "s3" {
    region       = local.region
    profile      = local.sso_profile_id
    bucket       = "bloom-dev-deployer-tofu-state"
    key          = "state"
    use_lockfile = true
  }
}

locals {
  region                           = "us-east-1"
  sso_profile_id                   = "bloom-permission-set-editor"
  iam_identity_center_instance_arn = "arn:aws:sso:::instance/ssoins-72233fa322bcade3"
}

provider "aws" {
  profile = local.sso_profile_id
  region  = local.region
}

resource "aws_ssoadmin_permission_set" "bloom_dev_deployer" {
  instance_arn     = local.iam_identity_center_instance_arn
  name             = "bloom-dev-deployer"
  description      = "Permission to configure a Bloom deployment in the bloom-dev-deployer account."
  session_duration = "PT1H"
}
resource "aws_ssoadmin_permission_set_inline_policy" "bloom_dev_deployer" {
  instance_arn       = local.iam_identity_center_instance_arn
  permission_set_arn = aws_ssoadmin_permission_set.bloom_dev_deployer.arn
  inline_policy      = data.aws_iam_policy_document.bloom_dev_deployer.json
}
data "aws_iam_policy_document" "bloom_dev_deployer" {
  statement {
    sid = "Statement1"
    actions = [
      "sts:GetCallerIdentity",
      "ec2:DescribeVpcs"
    ]
    resources = ["*"]
  }
}
