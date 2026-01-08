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
  bloom_deployment = "bloom-genai"
  sso_profile_id   = "${local.bloom_deployment}-deployer"

  tofu_state_bucket_region = "us-east-1"
  tofu_state_bucket_name   = "bloom-core-tofu-state-files"
  tofu_state_key_prefix    = local.bloom_deployment

  bloom_aws_account_number = 344261432650
  bloom_aws_region         = "us-west-2"
  domain_name              = "genai-test.bloomhousing.dev"
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

module "bloom_deployment" {
  source = "../../tofu_importable_modules/bloom_deployment"

  aws_profile        = local.sso_profile_id
  aws_account_number = local.bloom_aws_account_number
  aws_region         = local.bloom_aws_region

  domain_name         = aws_acm_certificate.bloom.domain_name
  aws_certificate_arn = aws_acm_certificate.bloom.arn

  env_type          = "dev"
  high_availability = false

  apply_seed = var.bloom_apply_seed

  bloom_api_image           = "ghcr.io/bloom-housing/bloom/api:gitsha-0ce113e71e6f6e3d87d347406d045cdc920001a7"
  bloom_site_partners_image = "ghcr.io/bloom-housing/bloom/partners:gitsha-0ce113e71e6f6e3d87d347406d045cdc920001a7"
  bloom_site_public_image   = "ghcr.io/bloom-housing/bloom/public:gitsha-0ce113e71e6f6e3d87d347406d045cdc920001a7"
  bloom_dbseed_image        = "ghcr.io/bloom-housing/bloom/dbseed:gitsha-0ce113e71e6f6e3d87d347406d045cdc920001a7"
  bloom_site_public_env_vars = {
    JURISDICTION_NAME     = "Doorway Data Explorer Test"
    CLOUDINARY_CLOUD_NAME = "exygy"
    LANGUAGES             = "en,es,zh,vi,tl"
    RTL_LANGUAGES         = "ar"
  }
  bloom_api_env_vars = {
    FAST_API_URL = "http://data-explorer-backend:8000"
  }
  bloom_api_fast_api_key_secret_arn = module.data_explorer_backend.api_key_secret_arn
}
output "aws_lb_dns_name" {
  value       = module.bloom_deployment.lb_dns_name
  description = "DNS name of the load balancer."
}

variable "bootstrap_db" {
  type        = bool
  description = "If true, bootstrap the database schema and indexes. Only run with this true once upon first deployment."
  default     = false
}
variable "apply_seed" {
  type        = bool
  description = "If true, upload seed SQL and import it during DB bootstrap."
  default     = false
}
variable "bloom_apply_seed" {
  type        = bool
  description = "If true, run the dbseed container to seed the Bloom database."
  default     = false
}
variable "seed_sql_path" {
  type        = string
  description = "Local path to seed SQL file (required if apply_seed=true)."
  default     = ""
}
variable "vertex_credentials_json_secret_arn" {
  type        = string
  description = "ARN of an AWS Secrets Manager secret whose value will be injected into the bloom-genai-backend container as VERTEX_CREDENTIALS_JSON."
  default     = "arn:aws:secretsmanager:us-west-2:344261432650:secret:vertex_credentials_json-4mFKgU"
}
variable "gcp_project_id" {
  type        = string
  description = "GCP Project ID for the Vertex AI project associated with the Vertex AI credentials."
  default     = "gen-lang-client-0598983018"
}

module "data_explorer_backend" {
  source = "../../tofu_importable_modules/data_explorer_backend"

  bloom_deployment = local.bloom_deployment

  aws_profile        = local.sso_profile_id
  aws_account_number = local.bloom_aws_account_number
  aws_region         = local.bloom_aws_region

  bootstrap_db         = var.bootstrap_db
  apply_seed           = var.apply_seed
  seed_sql_source_path = var.seed_sql_path

  env_type          = "dev"
  high_availability = false

  vpc_id                                     = module.bloom_deployment.vpc_id
  private_subnet_ids                         = module.bloom_deployment.private_subnet_ids
  ecs_cluster_arn                            = module.bloom_deployment.ecs_cluster_arn
  service_discovery_namespace_arn            = module.bloom_deployment.service_discovery_namespace_arn
  bloom_api_security_group_id                = module.bloom_deployment.security_group_ids.api
  secrets_manager_endpoint_security_group_id = module.bloom_deployment.security_group_ids.secrets_manager_endpoint

  data_explorer_backend_image = "ghcr.io/exygy/housing-reports/bloom-genai-backend:gitsha-8c1ec44f90a3ce738ed63f1575ac5847ae9e8fe6"
  

  cors_origins = "https://${local.domain_name},https://partners.${local.domain_name}"

  gcp_project_id = var.gcp_project_id
  vertex_credentials_json_secret_arn = var.vertex_credentials_json_secret_arn
}

output "data_explorer_api_key_secret_arn" {
  value       = module.data_explorer_backend.api_key_secret_arn
  description = "ARN of the API key secret for data explorer backend. Retrieve the value using: aws secretsmanager get-secret-value --secret-id <arn>"
}

output "data_explorer_service_name" {
  value       = module.data_explorer_backend.service_discovery_name
  description = "Service discovery name for data explorer backend. Bloom API can access it at http://data-explorer-backend:8000"
}

output "data_explorer_database_endpoint" {
  value       = module.data_explorer_backend.database_endpoint
  description = "Endpoint of the data explorer database."
}