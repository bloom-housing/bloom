data "aws_iam_policy_document" "data" {

  statement {
    actions = [
      "dms:List*",
      "rds:Describe*",
      "rds:Get*",
      "rds:List*",
      "s3:Describe*",
      "s3:Get*",
      "s3:List*",
    ]
    resources = ["*"]
  }
  statement {
    # Allow cloudshell to connect to the Bloom DB as the bloom_readonly DB user.
    actions   = ["rds-db:connect"]
    resources = ["arn:aws:rds-db:${local.region_account}:dbuser:*/bloom_readonly"]
  }

  statement {
    # https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.IAM.ServiceLinkedRoles.html
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
    # Allow listing all secrets and allow RDS to create a KMS key secret when the DB instance is
    # created.
    actions = [
      "kms:DescribeKey",
      "secretsmanager:CreateSecret",
      "secretsmanager:ListSecrets",
    ]
    resources = ["*"]
  }

  statement {
    # Allow management of Bloom secrets.
    actions = [
      "secretsmanager:DeleteSecret",
      "secretsmanager:DescribeSecret",
      "secretsmanager:GetResourcePolicy",
      "secretsmanager:PutResourcePolicy",
      "secretsmanager:PutSecretValue",
      "secretsmanager:TagResource",
    ]
    resources = [
      "arn:aws:secretsmanager:${local.region_account}:secret:bloom-api-jwt-signing-key*",
      "arn:aws:secretsmanager:${local.region_account}:secret:bloom-google-translate-api-key*",
      "arn:aws:secretsmanager:${local.region_account}:secret:bloom-mapbox-api-key*",
    ]
  }

  statement {
    # Allow describing the Bloom DB.
    actions   = ["rds:DescribeDBInstances"]
    resources = ["arn:aws:rds:${local.region_account}:db:*"]
  }

  statement {
    # https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/security_iam_id-based-policy-examples-create-and-modify-examples.html
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
      "arn:aws:rds:${local.region_account}:db:bloom",
      "arn:aws:rds:${local.region_account}:og:bloom",
      "arn:aws:rds:${local.region_account}:pg:bloom",
      "arn:aws:rds:${local.region_account}:snapshot:bloom-db-finalsnapshot",
      "arn:aws:rds:${local.region_account}:subgrp:bloom",
    ]
  }

  statement {
    # Only allow triggering one-off runs of the dbinit and dbseed tasks.
    actions = [
      "ecs:RunTask",
    ]
    resources = [
      "arn:aws:ecs:${local.region_account}:task-definition/bloom-dbinit:*",
      "arn:aws:ecs:${local.region_account}:task-definition/bloom-dbseed:*",
    ]
  }

  statement {
    # Allow operations on the Tofu State files.
    actions = [
      "s3:DeleteObject",
      "s3:GetObject",
      "s3:ListBucket",
      "s3:PutObject",
      "s3:PutObjectAcl",
    ]
    resources = [
      "arn:aws:s3:::${var.bloom_deployment_tofu_state_bucket_name}",
      "arn:aws:s3:::${var.bloom_deployment_tofu_state_bucket_name}/${var.bloom_deployment_tofu_state_file_prefix}/state",
      "arn:aws:s3:::${var.bloom_deployment_tofu_state_bucket_name}/${var.bloom_deployment_tofu_state_file_prefix}/state.tflock",
    ]
  }
  statement {
    # Allow creating S3 buckets for Bloom file storage.
    actions = [
      "s3:CreateBucket",
      "s3:DeleteBucket",
      "s3:DeleteBucketPolicy",
      "s3:DeleteObject",
      "s3:DeleteObjectVersion",
      "s3:Get*",
      "s3:ListBucket",
      "s3:PutBucketCORS",
      "s3:PutBucketPolicy",
      "s3:PutBucketPublicAccessBlock",
      "s3:PutLifecycleConfiguration",
    ]
    resources = ["arn:aws:s3:::bloom-*"]
  }
}