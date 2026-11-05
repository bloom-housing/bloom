# Permissions for humans debugging / looking at things through the AWS web console and CloudShell.
# None of these are required when running tofu apply, so this whole policy can later be moved to a
# separate read-only permission set by deleting its entry from local.managed_policies.
data "aws_iam_policy_document" "console" {
  statement {
    actions = [
      "application-autoscaling:Describe*",
      "aps:Describe*",
      "aps:List*",
      "cloudwatch:Describe*",
      "cloudwatch:Get*",
      "cloudwatch:List*",
      "dms:List*",
      "ec2:Describe*",
      "ec2:Get*",
      "ecs:List*",
      "elasticloadbalancing:Describe*",
      "events:Describe*",
      "events:Get*",
      "events:List*",
      "grafana:Describe*",
      "grafana:List*",
      "logs:Describe*",
      "logs:Filter*",
      "logs:Get*",
      "logs:List*",
      "logs:StartQuery",
      "logs:StopQuery",
      "logs:TestMetricFilter",
      "rds:Describe*",
      "rds:Get*",
      "rds:List*",
      "s3:Describe*",
      "s3:Get*",
      "s3:List*",
      "servicediscovery:Discover*",
      "servicediscovery:Get*",
      "servicediscovery:List*",
      "sms-voice:DescribePhoneNumbers",
      "sso:Get*",
      "sso:List*",
    ]
    resources = ["*"]
  }
  statement {
    # Allow any cloudshell action.
    actions = [
      "cloudshell:*"
    ]
    resources = ["*"]
  }
  statement {
    # Allow creating cloudshell instances attached to a VPC.
    actions = [
      "ec2:CreateNetworkInterface",
    ]
    resources = [
      "arn:aws:ec2:${local.region_account}:network-interface/*",
    ]
    condition {
      test     = "ForAnyValue:StringEquals"
      variable = "aws:TagKeys"
      values   = ["ManagedByCloudShell"]
    }
  }
  statement {
    # Allow creating a cloudshell instance attached to one of the bloom-private subnets.
    actions = [
      "ec2:CreateNetworkInterface",
    ]
    resources = [
      "arn:aws:ec2:${local.region_account}:subnet/*",
    ]
    condition {
      test     = "StringLike"
      variable = "aws:ResourceTag/Name"
      values   = ["bloom-private-*"]
    }
  }
  statement {
    # Allow creating a cloudshell instance with the bloom-cloudshell security group.
    actions = [
      "ec2:CreateNetworkInterface",
    ]
    resources = [
      "arn:aws:ec2:${local.region_account}:security-group/*",
    ]
    condition {
      test     = "StringEquals"
      variable = "aws:ResourceTag/Name"
      values   = ["bloom-cloudshell"]
    }
  }
  statement {
    # Allow cloudshell to tag the network interfaces it creates.
    actions = [
      "ec2:CreateTags",
    ]
    resources = ["arn:aws:ec2:${local.region_account}:network-interface/*"]
    condition {
      test     = "ForAnyValue:StringEquals"
      variable = "aws:TagKeys"
      values   = ["ManagedByCloudShell"]
    }
  }
  statement {
    # Allow cloudshell to configure and delete the network interfaces it creates.
    actions = [
      "ec2:CreateNetworkInterfacePermission",
      "ec2:DeleteNetworkInterface",
    ]
    resources = ["arn:aws:ec2:${local.region_account}:network-interface/*"]
    condition {
      test     = "StringEquals"
      variable = "aws:ResourceTag/ManagedByCloudShell"
      values   = [""]
    }
  }
  statement {
    # Allow cloudshell to connect to the Bloom DB as the bloom_readonly DB user.
    actions   = ["rds-db:connect"]
    resources = ["arn:aws:rds-db:${local.region_account}:dbuser:*/bloom_readonly"]
  }
}
