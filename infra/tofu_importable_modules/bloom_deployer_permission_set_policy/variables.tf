variable "iam_identity_center_instance_arn" {
  type        = string
  description = "ARN of the IAM Identity Center Instance where the bloom deployer permission set exists."
}
variable "permission_set_arn" {
  type        = string
  description = "ARN of the bloom deployer permission set to configure."
}

variable "bloom_deployment_aws_account_number" {
  type        = string
  description = "AWS account number of the bloom deployment account this permission set manages."
}
variable "bloom_deployment_aws_region" {
  type        = string
  description = "AWS region the bloom deployment will be deployed to."
}
variable "bloom_deployment_tofu_state_bucket_name" {
  type        = string
  description = "S3 bucket name that will store the OpenTofu state for the bloom deployment this permission set manages."
}
variable "bloom_deployment_tofu_state_file_prefix" {
  type        = string
  description = "Object name prefix for the OpenTofu state files for the bloom deployment this permission set manages."
}