terraform {
  required_providers {
    aws = {
      version = "6.16.0"
      source  = "hashicorp/aws"
    }
  }
}

variable "env_type" {
  type        = string
  description = "Type of environment this deployment is going in."
  validation {
    condition = (
      var.env_type == "dev" ||
      var.env_type == "production"
    )
    error_message = "Must be 'dev' or 'production'."
  }
}
variable "aws_account_number" {
  type        = number
  description = "AWS account number that is being configured."
}
variable "aws_region" {
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
locals {
  is_prod = var.env_type == "production"
}

# Create a CloudTrail data store so that audit events are query-able in SQL.
resource "aws_cloudtrail_event_data_store" "audit" {
  count = local.is_prod ? 1 : 0

  region                         = var.aws_region
  name                           = "audit"
  multi_region_enabled           = true
  retention_period               = 30
  termination_protection_enabled = true
}

