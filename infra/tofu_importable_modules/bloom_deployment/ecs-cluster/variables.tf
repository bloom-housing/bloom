variable "aws_account_number" {
  type        = string
  description = "AWS account number that is being configured."
}

variable "aws_profile" {
  type        = string
  description = "AWS CLI profile to use when running aws commands in local-exec provisioners."
  default     = ""
}

variable "aws_region" { # TODO move validations into top level module
  type        = string
  description = "Region to deploy AWS resources to"
  validation {
    condition = (
      var.aws_region == "us-east-1" ||
      var.aws_region == "us-east-2" ||
      var.aws_region == "us-west-1" ||
      var.aws_region == "us-west-2"
    )
    error_message = "Must be 'us-east-1', 'us-east-2', 'us-west-1', or 'us-west-2'."
  }
}

variable "aws_db_master_user_secrets" {
  type = list(object({
    kms_key_id    = string
    secret_arn    = string
    secret_status = string
  }))
  description = "AWS Managed db master user secret"
}

variable "aws_db_instance_id" {
  type        = string
  description = "AWS database instance id"
}

variable "aws_prometheus_workspace_arn" {
  type        = string
  description = "ARN pointing to the prometheus workspace"
}

variable "bloom_dbseed_image" {
  type        = string
  description = "Container image for the Bloom dbseed process. Leave empty to disable running the dbseed process."
  default     = ""
}

variable "ecs_logs_retention_days" {
  description = "How long ECS task logs are retained. Default is provided based on the env_type setting."
  type        = number
  default     = null
}

variable "secretsmanager_api_jwt_signing_key_arn" {
  type        = string
  description = "ARN for the API jwt signing key"
}

variable "secretsmanager_mapbox_api_key_arn" {
  type        = string
  description = "ARN for the Mapbox api key"
}

variable "secretsmanager_google_translate_api_key_arn" {
  type        = string
  description = "ARN for the Google Translate api key"
}
