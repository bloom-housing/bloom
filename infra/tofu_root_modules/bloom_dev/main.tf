terraform {
  required_providers {
    aws = {
      version = "6.21.0"
      source  = "hashicorp/aws"
    }
  }
  backend "s3" {
    profile      = local.sso_profile_id
    region       = local.tofu_state_bucket_region
    bucket       = local.tofu_state_bucket_name
    key          = "${local.tofu_state_key_prefix}/state"
    use_lockfile = true
  }
}

locals {
  bloom_deployment = "bloom-dev"
  sso_profile_id   = "${local.bloom_deployment}-deployer"

  tofu_state_bucket_region = "us-east-1"
  tofu_state_bucket_name   = "bloom-core-tofu-state-files"
  tofu_state_key_prefix    = local.bloom_deployment

  bloom_aws_account_number = 242477209009
  bloom_aws_region         = "us-west-2"
  domain_name              = "core-dev.bloomhousing.dev"
}

provider "aws" {
  profile = local.sso_profile_id
  region  = local.bloom_aws_region
}

# We need to create and validate a certificate for bloom_deployment module to deploy
# successfully. See the README.md for more details for how to deploy and validate the certificate
# before deploying the bloom_deployment module.
resource "aws_acm_certificate" "bloom" {
  region            = local.bloom_aws_region
  validation_method = "DNS"
  domain_name       = local.domain_name
  subject_alternative_names = [
    "partners.${local.domain_name}"
  ]
  lifecycle {
    create_before_destroy = true
  }
}
output "certificate_details" {
  value = {
    certificate_arn    = aws_acm_certificate.bloom.arn
    certificate_status = aws_acm_certificate.bloom.status
    expires_at         = aws_acm_certificate.bloom.not_after
    managed_renewal = {
      eligible = aws_acm_certificate.bloom.renewal_eligibility
      status   = aws_acm_certificate.bloom.renewal_summary
    }
    validation_dns_recods = aws_acm_certificate.bloom.domain_validation_options
  }
  description = "DNS records required to be manually added for the LB TLS certificate to be issued."
}

# Deploy bloom into the account.
module "bloom_deployment" {
  source = "../../tofu_importable_modules/bloom_deployment"

  aws_profile        = local.sso_profile_id
  aws_account_number = local.bloom_aws_account_number
  aws_region         = local.bloom_aws_region

  domain_name         = aws_acm_certificate.bloom.domain_name
  aws_certificate_arn = aws_acm_certificate.bloom.arn

  env_type          = "dev"
  high_availability = false

  bloom_api_image           = "ghcr.io/bloom-housing/bloom/api:gitsha-f642fc1f3f056b9fa53429c4fa81689c5e856e5a"
  bloom_site_partners_image = "ghcr.io/bloom-housing/bloom/partners:gitsha-f642fc1f3f056b9fa53429c4fa81689c5e856e5a"
  bloom_site_public_image   = "ghcr.io/bloom-housing/bloom/public:gitsha-f642fc1f3f056b9fa53429c4fa81689c5e856e5a"
  bloom_site_public_env_vars = {
    JURISDICTION_NAME     = "Bloomington"
    CLOUDINARY_CLOUD_NAME = "exygy"
    LANGUAGES             = "en,es,zh,vi,tl"
    RTL_LANGUAGES         = "ar"
  }
}
output "aws_lb_dns_name" {
  value       = module.bloom_deployment.lb_dns_name
  description = "DNS name of the load balancer."
}
