terraform {
  required_providers {
    aws = {
      version               = "6.21.0"
      source                = "hashicorp/aws"
      configuration_aliases = [aws.deployment_account]
    }
  }
}