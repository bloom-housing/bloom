locals {
  database_config = var.database_config != null ? var.database_config : (var.is_prod ? {
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

resource "aws_db_subnet_group" "bloom" {
  region     = var.aws_region
  name       = "bloom"
  subnet_ids = var.aws_private_subnet_ids
}

resource "aws_db_instance" "bloom" {
  identifier                      = "bloom"
  deletion_protection             = var.is_prod
  engine                          = "postgres"
  engine_version                  = "17"
  instance_class                  = local.database_config.instance_class
  multi_az                        = local.database_config.db_high_availability
  enabled_cloudwatch_logs_exports = ["postgresql", "upgrade", "iam-db-auth-error"]
  username                        = "master"
  manage_master_user_password     = true

  # Monitoring
  performance_insights_enabled          = "true"
  performance_insights_retention_period = 7 # minimum
  database_insights_mode                = "standard"

  # Networking
  vpc_security_group_ids              = [var.aws_security_group_bloom_db_id]
  iam_database_authentication_enabled = true
  db_subnet_group_name                = aws_db_subnet_group.bloom.id

  # Updates
  apply_immediately           = true # If false, any changes are applied in the next maintenance window instead of when tofu apply runs.
  engine_lifecycle_support    = "open-source-rds-extended-support"
  allow_major_version_upgrade = false
  auto_minor_version_upgrade  = true

  # Storage
  storage_encrypted         = true
  storage_type              = "gp2"
  allocated_storage         = var.database_config.starting_storage_gb
  max_allocated_storage     = var.database_config.max_storage_gb
  backup_retention_period   = var.database_config.backup_retention_days
  final_snapshot_identifier = "bloom-db-finalsnapshot"
  skip_final_snapshot       = !var.is_prod
}
