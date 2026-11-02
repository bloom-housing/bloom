# Messaging (SMS, SES), monitoring (Prometheus, Grafana, CloudTrail) and the SSO registration
# Grafana needs.
data "aws_iam_policy_document" "platform_services" {
  statement {
    # Allow managing the Pinpoint SMS Voice V2 phone number used for SMS functionality.
    actions = [
      "sms-voice:ListTagsForResource",
      "sms-voice:ReleasePhoneNumber",
      "sms-voice:RequestPhoneNumber",
      "sms-voice:TagResource",
      "sms-voice:UntagResource",
      "sms-voice:UpdatePhoneNumber",
    ]
    resources = ["arn:aws:sms-voice:${local.region_account}:phone-number/*"]
  }
  statement {
    # Allow creating SES identities.
    actions = [
      "ses:CreateEmailIdentity",
      "ses:DeleteEmailIdentity",
      "ses:GetEmailIdentity",
      "ses:ListTagsForResource",
    ]
    resources = ["arn:aws:ses:${local.region_account}:identity/*"]
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
