terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      version = "6.21.0"
      source  = "hashicorp/aws"
    }
  }
}
