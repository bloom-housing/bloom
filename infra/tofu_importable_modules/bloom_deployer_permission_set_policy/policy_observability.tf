data "aws_iam_policy_document" "observability" {
  statement {
    actions = [
      "aps:Describe*",
      "aps:List*",
      "cloudwatch:Describe*",
      "cloudwatch:Get*",
      "cloudwatch:List*",
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
      "sso:Get*",
      "sso:List*",
    ]
    resources = ["*"]
  }

  statement {
    # Allow creating Prometheus workspace.
    actions = [
      "aps:CreateWorkspace",
      "aps:DeleteWorkspace",
      "aps:DescribeLoggingConfiguration",
      "aps:DescribeWorkspace",
      "aps:ListTagsForResource",
    ]
    resources = [
      "arn:aws:aps:${local.region_account}:/workspaces", # For aps:CreateWorkspace
      "arn:aws:aps:${local.region_account}:workspace/*",
    ]
  }

  statement {
    # Allow creating Grafana workspace.
    actions = [
      "grafana:CreateWorkspace",
      "grafana:CreateWorkspaceServiceAccount",
      "grafana:CreateWorkspaceServiceAccountToken",
      "grafana:DeleteWorkspace",
      "grafana:DeleteWorkspaceServiceAccount",
      "grafana:DeleteWorkspaceServiceAccountToken",
      "grafana:DescribeWorkspace",
      "grafana:DescribeWorkspaceConfiguration",
      "grafana:UpdatePermissions",
      "grafana:UpdateWorkspace",
    ]
    resources = [
      "arn:aws:grafana:${local.region_account}:/workspaces*",
    ]
  }

  statement {
    # Allow registering Grafana workspace in SSO.
    actions = [
      "sso:AssociateProfile",
      "sso:CreateManagedApplicationInstance",
      "sso:DeleteManagedApplicationInstance",
      "sso:DescribeRegisteredRegions",
      "sso:DisassociateProfile",
    ]
    resources = [
      "*",
    ]
  }

  statement {
    # Allow creating cloudtrail logs.
    actions = [
      "cloudtrail:CreateEventDataStore",
      "cloudtrail:DeleteEventDataStore",
      "cloudtrail:GetEventDataStore",
      "cloudtrail:ListTags",
    ]
    resources = [
      "arn:aws:cloudtrail:${local.region_account}:eventdatastore/*",
    ]
  }
}