locals {
  is_prod                 = var.env_type == "production"
  ecs_logs_retention_days = var.ecs_logs_retention_days != null ? var.ecs_logs_retention_days : (local.is_prod ? 30 : 3)
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

module "alb" {
  source = "./alb"

  aws_certificate_arn    = var.aws_certificate_arn
  aws_vpc_id             = aws_vpc.bloom.id
  aws_public_subnet_ids  = [for s in aws_subnet.public : s.id]
  aws_security_group_ids = [aws_security_group.bloom["lb"].id]

  aws_region  = var.aws_region
  domain_name = var.domain_name
}

module "ecs_cluster" {
  source = "./ecs-cluster"

  aws_account_number = var.aws_account_number
  aws_profile        = var.aws_profile
  aws_region         = var.aws_region

  aws_db_master_user_secret = module.rds.master_user_secret
  aws_db_instance_id        = module.rds.aws_db_instance_id

  aws_prometheus_workspace_arn = aws_prometheus_workspace.bloom.arn

  bloom_dbseed_image = var.bloom_dbseed_image

  ecs_logs_retention_days = local.ecs_logs_retention_days


  secretsmanager_api_jwt_signing_key_arn      = module.secretsmanager.api_key_secret_arns["api_jwt_signing_key"]
  secretsmanager_mapbox_api_key_arn           = aws_secretsmanager_secret.mapbox_api_key.arn
  secretsmanager_google_translate_api_key_arn = aws_secretsmanager_secret.google_translate_api_key.arn
}

module "rds" {
  source = "./rds"

  aws_region                     = var.aws_region
  aws_private_subnet_ids         = [for s in aws_subnet.private : s.id]
  aws_security_group_bloom_db_id = aws_security_group.bloom["db"].id

  database_config = local.database_config

  is_prod = local.is_prod
}

module "secretsmanager" {
  source = "./secretsmanager"

  aws_profile = var.aws_profile
  aws_region  = var.aws_region
}
