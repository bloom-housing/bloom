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