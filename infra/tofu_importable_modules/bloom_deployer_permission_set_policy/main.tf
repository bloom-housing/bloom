

locals {
  region_account = "${var.bloom_deployment_aws_region}:${var.bloom_deployment_aws_account_number}"
  managed_policies = {
    "bloom-deployer-network"       = data.aws_iam_policy_document.network.json
    "bloom-deployer-compute"       = data.aws_iam_policy_document.compute.json
    "bloom-deployer-data"          = data.aws_iam_policy_document.data.json
    "bloom-deployer-messaging"     = data.aws_iam_policy_document.messaging.json
    "bloom-deployer-observability" = data.aws_iam_policy_document.observability.json
  }
}

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

resource "aws_ssoadmin_permission_set_inline_policy" "deployer" {
  instance_arn       = var.iam_identity_center_instance_arn
  permission_set_arn = var.permission_set_arn
  inline_policy      = data.aws_iam_policy_document.deployer.json
}
