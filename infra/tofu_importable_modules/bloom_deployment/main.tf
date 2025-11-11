terraform {
  required_providers {
    aws = {
      version = "6.21.0"
      source  = "hashicorp/aws"
    }
  }
}

variable "aws_profile" {
  type        = string
  description = "AWS CLI profile to use when running aws commands in local-exec provisioners."
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
locals {
  is_prod = var.env_type == "production"
}

variable "domain_name" {
  type        = string
  description = "Domain name the bloom deployment will be served on"
}
variable "aws_certificate_arn" {
  type        = string
  description = "ARN of the validated certificate for the domain_name"
}
variable "bloom_api_image" {
  type        = string
  description = "Container image for the Bloom API."
}
variable "bloom_site_partners_image" {
  type        = string
  description = "Container image for the Bloom partners site."
}
variable "bloom_site_public_image" {
  type        = string
  description = "Container image for the Bloom public site."
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

