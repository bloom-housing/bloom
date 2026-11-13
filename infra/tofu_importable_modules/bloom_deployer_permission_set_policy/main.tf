
locals {
  region_account = "${var.bloom_deployment_aws_region}:${var.bloom_deployment_aws_account_number}"

  # The IAM Identity Center permission set inline policy limit is 10,240 non-whitespace characters,
  # and each customer managed policy is limited to 6,144. To stay under both, the deployer's
  # permissions are split into several managed policies grouped by area (see policy_*.tf). Add a new
  # entry here when a group approaches ~5,500 characters rather than growing the inline policy.
  managed_policies = {
    "${var.managed_policy_name_prefix}-console"           = data.aws_iam_policy_document.console.json
    "${var.managed_policy_name_prefix}-network"           = data.aws_iam_policy_document.network.json
    "${var.managed_policy_name_prefix}-compute"           = data.aws_iam_policy_document.compute.json
    "${var.managed_policy_name_prefix}-data-stores"       = data.aws_iam_policy_document.data_stores.json
    "${var.managed_policy_name_prefix}-platform-services" = data.aws_iam_policy_document.platform_services.json
  }
}

# The policies must exist in the deployment account before the permission set is provisioned there.
resource "aws_iam_policy" "deployer" {
  provider = aws.deployment_account
  for_each = local.managed_policies

  name   = each.key
  path   = "/"
  policy = each.value
}

resource "aws_ssoadmin_customer_managed_policy_attachment" "deployer" {
  for_each = local.managed_policies

  instance_arn       = var.iam_identity_center_instance_arn
  permission_set_arn = var.permission_set_arn

  customer_managed_policy_reference {
    name = each.key
    path = "/"
  }

  depends_on = [aws_iam_policy.deployer]
}

# Only the small tofu state policy stays inline. It depends on the attachments so that, when
# migrating from the old single inline policy, permissions are added before they are removed.
resource "aws_ssoadmin_permission_set_inline_policy" "deployer" {
  instance_arn       = var.iam_identity_center_instance_arn
  permission_set_arn = var.permission_set_arn
  inline_policy      = data.aws_iam_policy_document.state.json

  depends_on = [aws_ssoadmin_customer_managed_policy_attachment.deployer]
}
