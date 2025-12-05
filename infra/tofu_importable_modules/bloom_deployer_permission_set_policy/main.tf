terraform {
  required_providers {
    aws = {
      version = "6.16.0"
      source  = "hashicorp/aws"
    }
  }
}

variable "iam_identity_center_instance_arn" {
  type        = string
  description = "ARN of the IAM Identity Center Instance where the bloom deployer permission set exists."
}
variable "permission_set_arn" {
  type        = string
  description = "ARN of the bloom deployer permission set to configure."
}

variable "bloom_deployment_aws_account_number" {
  type        = string
  description = "AWS account number that this policy is allowed to deploy to."
}
variable "bloom_deployment_aws_region" {
  type        = string
  description = "AWS region the bloom deployment will be deployed to."
}
variable "bloom_deployment_tofu_state_bucket_name" {
  type        = string
  description = "AWS S3 bucket that will store the Open Tofu state files for the bloom deployment."
}
variable "bloom_deployment_tofu_state_file_prefix" {
  type        = string
  description = "AWS S3 file prefix the bloom deployment will use for its Open Tofu state files."
}

resource "aws_ssoadmin_permission_set_inline_policy" "deployer" {
  instance_arn       = var.iam_identity_center_instance_arn
  permission_set_arn = var.permission_set_arn
  inline_policy      = data.aws_iam_policy_document.deployer.json
}
data "aws_iam_policy_document" "deployer" {
  statement {
    sid = "StateBucket"
    actions = [
      "s3:ListBucket",
    ]
    resources = ["arn:aws:s3:::${var.bloom_deployment_tofu_state_bucket_name}"]
  }
  statement {
    sid = "StateFiles"
    actions = [
      "s3:DeleteObject",
      "s3:GetObject",
      "s3:PutObject",
    ]
    resources = [
      "arn:aws:s3:::${var.bloom_deployment_tofu_state_bucket_name}/${var.bloom_deployment_tofu_state_file_prefix}/state",
      "arn:aws:s3:::${var.bloom_deployment_tofu_state_bucket_name}/${var.bloom_deployment_tofu_state_file_prefix}/state.tflock"
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
      "arn:aws:cloudtrail:${var.bloom_deployment_aws_account_number}:${var.bloom_deployment_aws_region}:eventdatastore/*",
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
      "arn:aws:iam::${var.bloom_deployment_aws_account_number}:role/aws-service-role/ecs.amazonaws.com/AWSServiceRoleForECS",
      "arn:aws:iam::${var.bloom_deployment_aws_account_number}:role/aws-service-role/elasticloadbalancing.amazonaws.com/AWSServiceRoleForElasticLoadBalancing",
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
      "arn:aws:acm:${var.bloom_deployment_aws_account_number}:${var.bloom_deployment_aws_region}:certificate/*",
      "arn:aws:ec2:${var.bloom_deployment_aws_account_number}:${var.bloom_deployment_aws_region}:elastic-ip/*",
      "arn:aws:ec2:${var.bloom_deployment_aws_account_number}:${var.bloom_deployment_aws_region}:internet-gateway/*",
      "arn:aws:ec2:${var.bloom_deployment_aws_account_number}:${var.bloom_deployment_aws_region}:natgateway/*",
      "arn:aws:ec2:${var.bloom_deployment_aws_account_number}:${var.bloom_deployment_aws_region}:route-table/*",
      "arn:aws:ec2:${var.bloom_deployment_aws_account_number}:${var.bloom_deployment_aws_region}:security-group-rule/*",
      "arn:aws:ec2:${var.bloom_deployment_aws_account_number}:${var.bloom_deployment_aws_region}:security-group/*",
      "arn:aws:ec2:${var.bloom_deployment_aws_account_number}:${var.bloom_deployment_aws_region}:subnet/*",
      "arn:aws:ec2:${var.bloom_deployment_aws_account_number}:${var.bloom_deployment_aws_region}:vpc-endpoint/*",
      "arn:aws:ec2:${var.bloom_deployment_aws_account_number}:${var.bloom_deployment_aws_region}:vpc/*",
      "arn:aws:elasticloadbalancing:${var.bloom_deployment_aws_account_number}:${var.bloom_deployment_aws_region}:listener-rule/app/bloom/*",
      "arn:aws:elasticloadbalancing:${var.bloom_deployment_aws_account_number}:${var.bloom_deployment_aws_region}:listener/app/bloom/*",
      "arn:aws:elasticloadbalancing:${var.bloom_deployment_aws_account_number}:${var.bloom_deployment_aws_region}:loadbalancer/app/bloom/*",
      "arn:aws:elasticloadbalancing:${var.bloom_deployment_aws_account_number}:${var.bloom_deployment_aws_region}:targetgroup/bloom-site-partners/*",
      "arn:aws:elasticloadbalancing:${var.bloom_deployment_aws_account_number}:${var.bloom_deployment_aws_region}:targetgroup/bloom-site-public/*",
    ]
  }
  statement {
    sid     = "DisassociateAddress"
    actions = ["ec2:DisassociateAddress"]
    # For some reason the DisassociateAdress calls use this resource pattern.
    resources = ["arn:aws:ec2:${var.bloom_deployment_aws_account_number}:${var.bloom_deployment_aws_region}:*/*"]
  }
  statement {
    # https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.IAM.ServiceLinkedRoles.html
    sid = "DBServiceLinkedRole"
    actions = [
      "iam:CreateServiceLinkedRole",
    ]
    resources = [
      "arn:aws:iam::${var.bloom_deployment_aws_account_number}:role/aws-service-role/rds.amazonaws.com/AWSServiceRoleForRDS",
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
    resources = ["arn:aws:rds:${var.bloom_deployment_aws_account_number}:${var.bloom_deployment_aws_region}:db:*"]
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
      "arn:aws:rds:${var.bloom_deployment_aws_account_number}:${var.bloom_deployment_aws_region}:db:bloom",
      "arn:aws:rds:${var.bloom_deployment_aws_account_number}:${var.bloom_deployment_aws_region}:og:bloom",
      "arn:aws:rds:${var.bloom_deployment_aws_account_number}:${var.bloom_deployment_aws_region}:pg:bloom",
      "arn:aws:rds:${var.bloom_deployment_aws_account_number}:${var.bloom_deployment_aws_region}:snapshot:bloom-db-finalsnapshot",
      "arn:aws:rds:${var.bloom_deployment_aws_account_number}:${var.bloom_deployment_aws_region}:subgrp:bloom",
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
        "arn:aws:ecs:${var.bloom_deployment_aws_account_number}:${var.bloom_deployment_aws_region}:cluster/bloom",
        "arn:aws:logs:${var.bloom_deployment_aws_account_number}:${var.bloom_deployment_aws_region}:log-group::log-stream:",
        "arn:aws:servicediscovery:${var.bloom_deployment_aws_account_number}:${var.bloom_deployment_aws_region}:*/*"
      ],
      flatten(
        [for name in ["api", "site-partners", "site-public"] : [
          "arn:aws:ecs:${var.bloom_deployment_aws_account_number}:${var.bloom_deployment_aws_region}:service-deployment/bloom/bloom-${name}/*",
          "arn:aws:ecs:${var.bloom_deployment_aws_account_number}:${var.bloom_deployment_aws_region}:service/bloom/bloom-${name}",
          "arn:aws:ecs:${var.bloom_deployment_aws_account_number}:${var.bloom_deployment_aws_region}:task-definition/bloom-${name}:*",
          "arn:aws:iam::${var.bloom_deployment_aws_account_number}:role/bloom-${name}-container",
          "arn:aws:iam::${var.bloom_deployment_aws_account_number}:role/bloom-${name}-ecs",
          "arn:aws:logs:${var.bloom_deployment_aws_account_number}:${var.bloom_deployment_aws_region}:log-group:bloom-${name}*",
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
    resources = ["arn:aws:secretsmanager:${var.bloom_deployment_aws_account_number}:${var.bloom_deployment_aws_region}:secret:bloom-api-jwt-signing-key*"]
  }
}
