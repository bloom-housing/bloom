variable "aws_certificate_arn" {
  type        = string
  description = "ARN of the validated certificate for the domain_name"
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

variable "aws_vpc_id" {
  type = string
  description = "AWS VPC Id"
}

variable "aws_public_subnet_ids" {
  type        = set(string)
  description = "AWS VPC Public subnet id"
}

variable "aws_security_group_ids" {
  type        = set(string)
  description = "Set of network security groups"
}

variable "domain_name" {
  type        = string
  description = "Domain name the bloom deployment will be served on"
}

variable "is_prod" {
  type        = bool
  description = "Whether the of environment this deployment is going in is production or not"
  default     = false
}

