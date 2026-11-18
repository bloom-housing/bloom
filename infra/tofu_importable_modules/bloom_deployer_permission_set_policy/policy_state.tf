# Inline policy on the permission set.
data "aws_iam_policy_document" "state" {
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
}
