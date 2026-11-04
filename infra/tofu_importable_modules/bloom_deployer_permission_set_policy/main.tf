# Only the small tofu state policy stays inline. It depends on the attachments so that, when
# migrating from the old single inline policy, permissions are added before they are removed.
resource "aws_ssoadmin_permission_set_inline_policy" "deployer" {
  instance_arn       = var.iam_identity_center_instance_arn
  permission_set_arn = var.permission_set_arn
  inline_policy      = data.aws_iam_policy_document.state.json

  depends_on = [aws_ssoadmin_customer_managed_policy_attachment.deployer]
}
