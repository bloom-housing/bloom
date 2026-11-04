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