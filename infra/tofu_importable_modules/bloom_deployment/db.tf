# Create a database.
resource "aws_db_subnet_group" "bloom" {
  region     = var.aws_region
  name       = "bloom"
  subnet_ids = [for s in aws_subnet.private : s.id]
}
resource "aws_db_instance" "bloom" {
  identifier                      = "bloom"
  deletion_protection             = local.is_prod
  engine                          = "postgres"
  engine_version                  = "17"
  instance_class                  = local.database_config.instance_class
  multi_az                        = var.high_availability
  enabled_cloudwatch_logs_exports = ["postgresql", "upgrade", "iam-db-auth-error"]
  username                        = "master"
  manage_master_user_password     = true

  # Monitoring
  performance_insights_enabled          = "true"
  performance_insights_retention_period = 7 # minimum
  database_insights_mode                = "standard"

  # Networking
  vpc_security_group_ids              = [aws_security_group.db.id]
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
  allocated_storage         = local.database_config.starting_storage_gb
  max_allocated_storage     = local.database_config.max_storage_gb
  backup_retention_period   = local.database_config.backup_retention_days
  final_snapshot_identifier = "bloom-db-finalsnapshot"
  skip_final_snapshot       = !local.is_prod
}
