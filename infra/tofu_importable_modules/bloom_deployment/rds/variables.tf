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

variable "aws_private_subnet_ids" {
  type        = set(string)
  description = "A set of subnet IDs to use with the ALB"
}

variable "aws_security_group_bloom_db_id" {
  type        = string
  description = "Security Group ID for the bloom db"
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
    db_high_availability  = bool
  })
  default = null
}

variable "is_prod" {
  type        = bool
  description = "Whether the of environment this deployment is going in is production or not"
  default     = false
}
