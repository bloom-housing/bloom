terraform {
  required_providers {
    aws = {
      version = "6.21.0"
      source  = "hashicorp/aws"
    }
    null = {
      source = "hashicorp/null"
      version = "3.2.2"
    }
  }
}

variable "bloom_deployment" {
  type        = string
  description = "The name of the bloom deployment to use as a prefix."
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

# Bloom infrastructure references
variable "vpc_id" {
  type        = string
  description = "ID of the Bloom VPC to deploy into."
}
variable "private_subnet_ids" {
  type        = list(string)
  description = "IDs of private subnets in the Bloom VPC."
}
variable "ecs_cluster_arn" {
  type        = string
  description = "ARN of the Bloom ECS cluster."
}
variable "service_discovery_namespace_arn" {
  type        = string
  description = "ARN of the Bloom service discovery namespace."
}
variable "bloom_api_security_group_id" {
  type        = string
  description = "Security group ID of the Bloom API tasks."
}
variable "secrets_manager_endpoint_security_group_id" {
  type        = string
  description = "Security group ID of the secrets manager VPC endpoint."
}

# Container image
variable "data_explorer_backend_image" {
  type        = string
  description = "Container image for the data explorer backend."
}

# Environment-specific settings
variable "high_availability" {
  type        = bool
  description = "Deploy services in a highly-available manner."
  default     = true
}
variable "database_config" {
  description = "Settings for the data explorer database. Defaults are provided based on the env_type setting."
  type = object({
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
    instance_class        = "db.t4g.small"
    starting_storage_gb   = 10
    max_storage_gb        = 50
    backup_retention_days = 30
    } : {
    # Non-prod defaults
    instance_class        = "db.t4g.micro"
    starting_storage_gb   = 5 # minimum
    max_storage_gb        = 10
    backup_retention_days = 7
  })
}

variable "task_count" {
  description = "How many data explorer backend tasks should be running. Default is provided based on the high_availability setting."
  type        = number
  default     = null
}
locals {
  task_count = var.task_count != null ? var.task_count : (var.high_availability ? 2 : 1)
}

variable "ecs_logs_retention_days" {
  description = "How long ECS task logs are retained. Default is provided based on the env_type setting."
  type        = number
  default     = null
}
locals {
  ecs_logs_retention_days = var.ecs_logs_retention_days != null ? var.ecs_logs_retention_days : (local.is_prod ? 30 : 3)
}

# Application environment variables
variable "data_explorer_env_vars" {
  type        = map(any)
  description = "Environment variables for the data explorer backend tasks. This is merged with the default env vars, with these variables taking precedence."
  default     = {}
}

# CORS configuration
variable "cors_origins" {
  type        = string
  description = "Comma-separated list of allowed CORS origins."
}

# GCP configuration for AI provider
variable "gcp_project_id" {
  type        = string
  description = "GCP project ID for Vertex AI."
  default     = ""
  validation {
    condition = var.ai_provider != "vertex_ai" || length(trimspace(var.gcp_project_id)) > 0
    error_message = "gcp_project_id must be set when ai_provider = 'vertex_ai'."
  }
}
variable "gcp_location" {
  type        = string
  description = "GCP location for Vertex AI."
  default     = "us-central1"
}
variable "ai_provider" {
  type        = string
  description = "AI provider to use (vertex_ai or other)."
  default     = "vertex_ai"
}

variable "bootstrap_db" {
  type        = bool
  description = "If true, run a one-off ECS task on create/update to apply schema, optionally import data, and apply indexes."
  default     = false
}
variable "apply_seed" {
  type        = bool
  description = "If true, bootstrap will import the seed SQL (after truncating the applications table)."
  default     = false
}
variable "init_sql_source_path" {
  type        = string
  description = "Local path to init_postgres.sql to upload to S3. If empty, module's default file is used."
  default     = ""
}
variable "indexes_sql_source_path" {
  type        = string
  description = "Local path to indexes.sql to upload to S3. If empty, module's default file is used."
  default     = ""
}
variable "seed_sql_source_path" {
  type        = string
  description = "Local path to the seed SQL file to upload to S3 (only used when apply_seed=true)."
  default     = ""
  validation {
    condition     = !var.apply_seed || length(trimspace(var.seed_sql_source_path)) > 0
    error_message = "apply_seed=true requires seed_sql_source_path to be set."
  }
}
variable "vertex_credentials_json_secret_arn" {
  type        = string
  description = "ARN of an AWS Secrets Manager secret whose value will be injected into the container as VERTEX_CREDENTIALS_JSON."
  default     = ""
  validation {
    condition     = var.ai_provider != "vertex_ai" || length(trimspace(var.vertex_credentials_json_secret_arn)) > 0
    error_message = "vertex_credentials_json_secret_arn must be set when ai_provider = 'vertex_ai'."
  }
}

# Outputs
output "api_key_secret_arn" {
  value       = aws_secretsmanager_secret.api_key.arn
  description = "ARN of the API key secret for data explorer backend."
}
output "database_endpoint" {
  value       = aws_db_instance.data_explorer.endpoint
  description = "Endpoint of the data explorer database."
}
output "service_discovery_name" {
  value       = "data-explorer-backend"
  description = "Service discovery name for the data explorer backend."
}
output "security_group_id" {
  value       = aws_security_group.data_explorer.id
  description = "Security group ID for the data explorer backend tasks."
}