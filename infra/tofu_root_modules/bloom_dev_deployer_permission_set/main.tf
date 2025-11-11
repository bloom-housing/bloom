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
      "s3:DeleteBucket",
      "s3:GetAccelerateConfiguration",
      "s3:GetBucketAcl",
      "s3:GetBucketCors",
      "s3:GetBucketLogging",
      "s3:GetBucketObjectLockConfiguration",
      "s3:GetBucketPolicy",
      "s3:GetBucketRequestPayment",
      "s3:GetBucketTagging",
      "s3:GetBucketVersioning",
      "s3:GetBucketWebsite",
      "s3:GetEncryptionConfiguration",
      "s3:GetLifecycleConfiguration",
      "s3:GetReplicationConfiguration",
      "s3:ListBucket",
      "s3:PutBucketVersioning",
    ]
    resources = ["arn:aws:s3:::bloom-dev-tofu-state"]
  }
  statement {
    sid = "StateFiles"
    actions = [
      "s3:DeleteObject",
      "s3:GetObject",
      "s3:PutObject",
    ]
    resources = [
      "arn:aws:s3:::bloom-dev-tofu-state/state",
      "arn:aws:s3:::bloom-dev-tofu-state/state.tflock"
    ]
  }
  statement {
    sid = "CloudTrail"
    actions = [
      "cloudtrail:CreateEventDataStore",
      "cloudtrail:DeleteEventDataStore",
      "cloudtrail:GetEventDataStore",
      "cloudtrail:ListTags",
    ]
    resources = [
      "arn:aws:cloudtrail:*:*:eventdatastore/*",
    ]
  }
  statement {
    # These calls are not scoped to a specific resource.
    sid = "DescribeVPC"
    actions = [
      "ec2:DescribeAddresses",
      "ec2:DescribeAddressesAttribute",
      "ec2:DescribeAvailabilityZones",
      "ec2:DescribeInternetGateways",
      "ec2:DescribeNatGateways",
      "ec2:DescribeNetworkInterfaces",
      "ec2:DescribeSubnets",
      "ec2:DescribeVpcs",
    ]
    resources = ["*"]
  }
  statement {
    sid = "ConfigureVPC"
    actions = [
      "ec2:AllocateAddress",
      "ec2:AttachInternetGateway",
      "ec2:CreateInternetGateway",
      "ec2:CreateNatGateway",
      "ec2:CreateSubnet",
      "ec2:CreateTags",
      "ec2:CreateVpc",
      "ec2:DeleteInternetGateway",
      "ec2:DeleteNatGateway",
      "ec2:DeleteSubnet",
      "ec2:DeleteVPC",
      "ec2:DescribeVpcAttribute",
      "ec2:DetachInternetGateway",
      "ec2:ModifySubnetAttribute",
      "ec2:ReleaseAddress",
    ]
    resources = [
      "arn:aws:ec2:*:*:elastic-ip/*",
      "arn:aws:ec2:*:*:internet-gateway/*",
      "arn:aws:ec2:*:*:natgateway/*",
      "arn:aws:ec2:*:*:subnet/*",
      "arn:aws:ec2:*:*:vpc/*",
    ]
  }
  statement {
    # https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.IAM.ServiceLinkedRoles.html
    sid = "DBServiceAccount"
    actions = [
      "iam:CreateServiceLinkedRole",
    ]
    resources = [
      "arn:aws:iam::*:role/aws-service-role/rds.amazonaws.com/AWSServiceRoleForRDS",
    ]
    condition {
      test     = "StringLike"
      variable = "iam:AWSServiceName"
      values   = ["rds.amazonaws.com"]
    }
  }
  statement {
    # https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.IAM.ServiceLinkedRoles.html
    sid = "DBMasterUserPassword"
    actions = [
      "kms:DescribeKey",
      "secretsmanager:CreateSecret",
      "secretsmanager:TagResource",
    ]
    resources = ["*"]
  }
  statement {
    # https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/security_iam_id-based-policy-examples-create-and-modify-examples.html
    sid       = "DescribeDB"
    actions   = ["rds:DescribeDBInstances"]
    resources = ["arn:aws:rds:*:*:db:*"]
  }
  statement {
    # https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/security_iam_id-based-policy-examples-create-and-modify-examples.html
    sid = "ConfigureDB"
    actions = [
      "rds:CreateDBInstance",
      "rds:CreateDBSnapshot",
      "rds:CreateDBSubnetGroup",
      "rds:DeleteDBInstance",
      "rds:DeleteDBSubnetGroup",
      "rds:DescribeDBInstances",
      "rds:DescribeDBSubnetGroups",
      "rds:ListTagsForResource",
    ]
    resources = [
      "arn:aws:rds:*:*:db:bloom",
      "arn:aws:rds:*:*:og:bloom",
      "arn:aws:rds:*:*:pg:bloom",
      "arn:aws:rds:*:*:snapshot:bloom-db-finalsnapshot",
      "arn:aws:rds:*:*:subgrp:bloom",
    ]
  }
}
