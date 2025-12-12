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
    sid = "ServiceLinkedRole"
    actions = [
      "iam:CreateServiceLinkedRole",
      "iam:DeleteServiceLinkedRole",
      "iam:GetRole",
      "iam:GetServiceLinkedRoleDeletionStatus",
    ]
    resources = [
      "arn:aws:iam::*:role/aws-service-role/ecs.amazonaws.com/AWSServiceRoleForECS",
      "arn:aws:iam::*:role/aws-service-role/elasticloadbalancing.amazonaws.com/AWSServiceRoleForElasticLoadBalancing",
    ]
  }
  statement {
    # These calls are not scoped to a specific resource.
    sid = "DescribeVPC"
    actions = [
      "acm:ListCertificates",
      "ec2:DescribeAccountAttributes",
      "ec2:DescribeAddresses",
      "ec2:DescribeAddressesAttribute",
      "ec2:DescribeAvailabilityZones",
      "ec2:DescribeInternetGateways",
      "ec2:DescribeNatGateways",
      "ec2:DescribeNetworkAcls",
      "ec2:DescribeNetworkInterfaces",
      "ec2:DescribePrefixLists",
      "ec2:DescribeRouteTables",
      "ec2:DescribeSecurityGroupRules",
      "ec2:DescribeSecurityGroups",
      "ec2:DescribeSubnets",
      "ec2:DescribeVpcEndpoints",
      "ec2:DescribeVpcs",
      "elasticloadbalancing:DescribeListenerAttributes",
      "elasticloadbalancing:DescribeListeners",
      "elasticloadbalancing:DescribeLoadBalancerAttributes",
      "elasticloadbalancing:DescribeLoadBalancers",
      "elasticloadbalancing:DescribeRules",
      "elasticloadbalancing:DescribeTags",
      "elasticloadbalancing:DescribeTargetGroupAttributes",
      "elasticloadbalancing:DescribeTargetGroups",
    ]
    resources = ["*"]
  }
  statement {
    sid = "ConfigureVPC"
    actions = [
      "acm:DeleteCertificate",
      "acm:DescribeCertificate",
      "acm:GetCertificate",
      "acm:ListTagsForCertificate",
      "acm:RequestCertificate",
      "ec2:AllocateAddress",
      "ec2:AssociateRouteTable",
      "ec2:AssociateVpcCidrBlock",
      "ec2:AttachInternetGateway",
      "ec2:AuthorizeSecurityGroupEgress",
      "ec2:AuthorizeSecurityGroupIngress",
      "ec2:CreateInternetGateway",
      "ec2:CreateNATGateway",
      "ec2:CreateNatGateway",
      "ec2:CreateRoute",
      "ec2:CreateRouteTable",
      "ec2:CreateSecurityGroup",
      "ec2:CreateSubnet",
      "ec2:CreateTags",
      "ec2:CreateTags",
      "ec2:CreateVpc",
      "ec2:CreateVpcEndpoint",
      "ec2:DeleteInternetGateway",
      "ec2:DeleteNatGateway",
      "ec2:DeleteRouteTable",
      "ec2:DeleteSecurityGroup",
      "ec2:DeleteSubnet",
      "ec2:DeleteVPC",
      "ec2:DeleteVpcEndpoints",
      "ec2:DescribeVpcAttribute",
      "ec2:DetachInternetGateway",
      "ec2:DisassociateRouteTable",
      "ec2:DisassociateVpcCidrBlock",
      "ec2:ModifySubnetAttribute",
      "ec2:ModifyVpcAttribute",
      "ec2:ModifyVpcEndpoint",
      "ec2:ReleaseAddress",
      "ec2:RevokeSecurityGroupEgress",
      "ec2:RevokeSecurityGroupIngress",
      "elasticloadbalancing:AddTags",
      "elasticloadbalancing:CreateListener",
      "elasticloadbalancing:CreateLoadBalancer",
      "elasticloadbalancing:CreateRule",
      "elasticloadbalancing:CreateTargetGroup",
      "elasticloadbalancing:DeleteListener",
      "elasticloadbalancing:DeleteLoadBalancer",
      "elasticloadbalancing:DeleteRule",
      "elasticloadbalancing:DeleteTargetGroup",
      "elasticloadbalancing:ModifyListener",
      "elasticloadbalancing:ModifyLoadBalancerAttributes",
      "elasticloadbalancing:ModifyTargetGroup",
      "elasticloadbalancing:ModifyTargetGroupAttributes",
    ]
    resources = [
      "arn:aws:acm:*:*:certificate/*",
      "arn:aws:ec2:*:*:elastic-ip/*",
      "arn:aws:ec2:*:*:internet-gateway/*",
      "arn:aws:ec2:*:*:natgateway/*",
      "arn:aws:ec2:*:*:route-table/*",
      "arn:aws:ec2:*:*:security-group-rule/*",
      "arn:aws:ec2:*:*:security-group/*",
      "arn:aws:ec2:*:*:subnet/*",
      "arn:aws:ec2:*:*:vpc-endpoint/*",
      "arn:aws:ec2:*:*:vpc/*",
      "arn:aws:elasticloadbalancing:*:*:listener-rule/app/bloom/*",
      "arn:aws:elasticloadbalancing:*:*:listener/app/bloom/*",
      "arn:aws:elasticloadbalancing:*:*:loadbalancer/app/bloom/*",
      "arn:aws:elasticloadbalancing:*:*:targetgroup/bloom-site-partners/*",
      "arn:aws:elasticloadbalancing:*:*:targetgroup/bloom-site-public/*",
    ]
  }
  statement {
    sid     = "DisassociateAddress"
    actions = ["ec2:DisassociateAddress"]
    # For some reason the DisassociateAdress calls use this resource pattern.
    resources = ["arn:aws:ec2:*:*:*/*"]
  }
  statement {
    # https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.IAM.ServiceLinkedRoles.html
    sid = "DBServiceLinkedRole"
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
    sid = "DBMasterUserPassword"
    actions = [
      "kms:DescribeKey",
      "secretsmanager:CreateSecret",
      "secretsmanager:TagResource",
    ]
    resources = ["*"]
  }
  statement {
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
      "rds:ModifyDBInstance",
    ]
    resources = [
      "arn:aws:rds:*:*:db:bloom",
      "arn:aws:rds:*:*:og:bloom",
      "arn:aws:rds:*:*:pg:bloom",
      "arn:aws:rds:*:*:snapshot:bloom-db-finalsnapshot",
      "arn:aws:rds:*:*:subgrp:bloom",
    ]
  }
  statement {
    # For some reason the task APIs operate on the * resouce and don't support targeting the
    # resource directly in the IAM policy.
    sid = "ECSTaskDefinition"
    actions = [
      "ecs:DeregisterTaskDefinition",
      "ecs:DescribeTaskDefinition",
    ]
    resources = ["*"]
  }
  statement {
    sid = "ConfigureECS"
    actions = [
      "ecs:CreateCluster",
      "ecs:CreateService",
      "ecs:DeleteCluster",
      "ecs:DeleteService",
      "ecs:DescribeClusters",
      "ecs:DescribeServiceDeployments",
      "ecs:DescribeServices",
      "ecs:ListServiceDeployments",
      "ecs:ListTagsForResource",
      "ecs:RegisterTaskDefinition",
      "ecs:UpdateCluster",
      "ecs:UpdateService",
      "iam:CreateRole",
      "iam:DeleteRole",
      "iam:DeleteRolePolicy",
      "iam:GetRole",
      "iam:GetRolePolicy",
      "iam:ListAttachedRolePolicies",
      "iam:ListInstanceProfilesForRole",
      "iam:ListRolePolicies",
      "iam:PassRole",
      "iam:PutRolePolicy",
      "logs:CreateLogGroup",
      "logs:DeleteLogGroup",
      "logs:DescribeLogGroups",
      "logs:ListTagsForResource",
      "logs:PutRetentionPolicy",
      "servicediscovery:CreateHttpNamespace",
      "servicediscovery:DeleteNamespace",
      "servicediscovery:GetNamespace",
      "servicediscovery:GetOperation",
      "servicediscovery:ListTagsForResource",
    ]
    resources = concat(
      [
        "arn:aws:ecs:*:*:cluster/bloom",
        "arn:aws:logs:*:*:log-group::log-stream:",
        "arn:aws:servicediscovery:*:*:*/*"
      ],
      flatten(
        [for name in ["api", "site-partners", "site-public"] : [
          "arn:aws:ecs:*:*:service-deployment/bloom/bloom-${name}/*",
          "arn:aws:ecs:*:*:service/bloom/bloom-${name}",
          "arn:aws:ecs:*:*:task-definition/bloom-${name}:*",
          "arn:aws:iam::*:role/bloom-${name}-container",
          "arn:aws:iam::*:role/bloom-${name}-ecs",
          "arn:aws:logs:*:*:log-group:bloom-${name}*",
        ]]
    ))
  }
  statement {
    sid = "APIJWTKeySecret"
    actions = [
      "secretsmanager:CreateSecret",
      "secretsmanager:DeleteSecret",
      "secretsmanager:DescribeSecret",
      "secretsmanager:GetResourcePolicy",
      "secretsmanager:PutResourcePolicy",
      "secretsmanager:PutSecretValue",
      "secretsmanager:TagResource",
    ]
    resources = ["arn:aws:secretsmanager:*:*:secret:bloom-api-jwt-signing-key*"]
  }
}
