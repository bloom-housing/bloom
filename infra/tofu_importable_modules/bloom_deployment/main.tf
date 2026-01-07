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
variable "vpc_cidr_range" {
  type        = string
  description = "The CIDR range to use for the Bloom VPC. Must be a /22 block in the RFC 1918 private IP space."
  default     = "10.0.0.0/22"
  validation {
    condition = (
      cidrcontains("10.0.0.0/8", var.vpc_cidr_range) ||
      cidrcontains("172.16.0.0/12", var.vpc_cidr_range) ||
      cidrcontains("192.168.0.0/16", var.vpc_cidr_range)
    )
    error_message = "Must be in the RFC 1918 private IP space."
  }
  validation {
    condition     = cidrnetmask(var.vpc_cidr_range) == cidrnetmask("10.0.0.0/22")
    error_message = "Must be a /22."
  }
}
variable "high_availability" {
  type        = bool
  description = "Deploy the Bloom services in a highly-available manner. If true, a minimum of 2 instances will be running for each Bloom service."
  default     = true
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
variable "database_config" {
  description = "Settings for the Bloom database. Defaults are provided based on the env_type setting."
  type = object({
    # Pricing: https://aws.amazon.com/rds/postgresql/pricing/?pg=pr&loc=3
    # Machine specs: https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.DBInstanceClass.Summary.html#hardware-specifications.burstable-inst-classes
    instance_class        = string
    starting_storage_gb   = number
    max_storage_gb        = number
    backup_retention_days = number
  })
  default = null
}
locals {
  database_config = var.database_config != null ? var.database_config : (local.is_prod ? {
    # Prod defaults
    instance_class        = "db.t4g.medium"
    starting_storage_gb   = 10
    max_storage_gb        = 100
    backup_retention_days = 30
    } : {
    # Non-prod defaults
    instance_class        = "db.t4g.micro"
    starting_storage_gb   = 5 # minimum
    max_storage_gb        = 10
    backup_retention_days = 7
  })
}

variable "domain_name" {
  type        = string
  description = "Domain name the bloom deployment will be served on"
}
variable "aws_certificate_arn" {
  type        = string
  description = "ARN of the validated certificate for the domain_name"
}

variable "ecs_logs_retention_days" {
  description = "How long ECS task logs are retained. Default is provided based on the env_type setting."
  type        = number
  default     = null
}
locals {
  ecs_logs_retention_days = var.ecs_logs_retention_days != null ? var.ecs_logs_retention_days : (local.is_prod ? 30 : 3)
}

variable "bloom_api_image" {
  type        = string
  description = "Container image for the Bloom API."
}
variable "bloom_api_env_vars" {
  type        = map(any)
  description = "Environment variables for the Bloom API tasks. This is merged with the default env vars set in the ecs_api_task.tf file, with these variables taking precedence."
  default     = {}
}
variable "bloom_api_task_count" {
  description = "How many API tasks that should be running. Default is provided based on the high_availability setting."
  type        = number
  default     = null
}
locals {
  bloom_api_task_count = var.bloom_api_task_count != null ? var.bloom_api_task_count : (var.high_availability ? 2 : 1)
}
variable "bloom_site_partners_image" {
  type        = string
  description = "Container image for the Bloom partners site."
}
variable "bloom_site_partners_env_vars" {
  type        = map(any)
  description = "Environment variables for the Bloom partners site tasks. This is merged with the default env vars set in the ecs_site_partners_task.tf file, with these variables taking precedence."
  default     = {}
}
variable "bloom_site_partners_task_count" {
  description = "How many partners site tasks that should be running. Default is provided based on the high_availability setting."
  type        = number
  default     = null
}
locals {
  bloom_site_partners_task_count = var.bloom_site_partners_task_count != null ? var.bloom_site_partners_task_count : (var.high_availability ? 2 : 1)
}
variable "bloom_site_public_image" {
  type        = string
  description = "Container image for the Bloom public site."
}
variable "bloom_site_public_env_vars" {
  type        = map(any)
  description = "Environment variables for the Bloom public site tasks. This is merged with the default env vars set in the ecs_site_public_task.tf file, with these variables taking precedence."
  default     = {}
}
variable "bloom_site_public_task_count" {
  description = "How many public site tasks that should be running. Default is provided based on the high_availability setting."
  type        = number
  default     = null
}
locals {
  bloom_site_public_task_count = var.bloom_site_public_task_count != null ? var.bloom_site_public_task_count : (var.high_availability ? 2 : 1)
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

