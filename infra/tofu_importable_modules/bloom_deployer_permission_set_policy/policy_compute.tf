data "aws_iam_policy_document" "compute" {
  statement {
    actions = [
      "servicediscovery:Discover*",
      "servicediscovery:Get*",
      "servicediscovery:List*",

      # For some reason the task APIs operate on the * resource and don't support targeting the
      # resource directly in the IAM policy.
      "ecs:DeregisterTaskDefinition",
      "ecs:DescribeTaskDefinition",
    ]
    resources = ["*"]
  }

  statement {
    # Configure the Bloom ECS cluster.
    actions = [
      "application-autoscaling:Describe*",
      "application-autoscaling:RegisterScalableTarget",
      "ecs:CreateCluster",
      "ecs:CreateService",
      "ecs:DeleteCluster",
      "ecs:DeleteService",
      "ecs:DescribeClusters",
      "ecs:DescribeServiceDeployments",
      "ecs:DescribeServices",
      "ecs:DescribeTasks",
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
    resources = [
      "arn:aws:ecs:${local.region_account}:cluster/bloom",
      "arn:aws:ecs:${local.region_account}:service-deployment/bloom/bloom-*",
      "arn:aws:ecs:${local.region_account}:service/bloom/bloom-*",
      "arn:aws:ecs:${local.region_account}:task-definition/bloom-*",
      "arn:aws:ecs:${local.region_account}:task/bloom/*",
      "arn:aws:iam::${var.bloom_deployment_aws_account_number}:role/bloom-*",
      "arn:aws:iam::${var.bloom_deployment_aws_account_number}:role/bloom-*",
      "arn:aws:logs:${local.region_account}:log-group::log-stream:",
      "arn:aws:logs:${local.region_account}:log-group:bloom-*",
      "arn:aws:servicediscovery:${local.region_account}:*/*",
    ]
  }
}