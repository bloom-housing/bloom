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
    sid = "StateBucket"
    actions = [
      "s3:CreateBucket",
      "s3:GetAccelerateConfiguration",
      "s3:GetBucketAcl",
      "s3:GetBucketCors",
      "s3:GetBucketLogging",
      "s3:GetBucketObjectLockConfiguration",
      "s3:GetBucketPolicy",
      "s3:GetBucketRequestPayment",
      "s3:GetBucketVersioning",
      "s3:GetBucketWebsite",
      "s3:GetEncryptionConfiguration",
      "s3:GetLifecycleConfiguration",
      "s3:GetReplicationConfiguration",
      "s3:ListBucket",
      "s3:GetBucketTagging",
      "s3:PutBucketVersioning",
    ]
    resources = ["arn:aws:s3:::bloom-dev-tofu-state"]
  }
  statement {
    sid = "StateFiles"
    actions = [
      "s3:GetObject",
      "s3:PutObject",
      "s3:DeleteObject"
    ]
    resources = [
      "arn:aws:s3:::bloom-dev-tofu-state/state",
      "arn:aws:s3:::bloom-dev-tofu-state/state.tflock"
    ]
  }
}
