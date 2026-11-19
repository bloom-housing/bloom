terraform {
  required_providers {
    aws = {
      version = "6.21.0"
      source  = "hashicorp/aws"

      # The managed policies live in the bloom deployment account, while the permission set lives
      # in the IAM Identity Center account. The caller passes a provider for each.
      configuration_aliases = [aws.deployment_account]
    }
  }
}