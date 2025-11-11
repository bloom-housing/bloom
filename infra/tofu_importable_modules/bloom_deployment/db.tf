# Create a database.
locals {
  # Pricing: https://aws.amazon.com/rds/postgresql/pricing/?pg=pr&loc=3
  # Machine specs: https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.DBInstanceClass.Summary.html#hardware-specifications.burstable-inst-classes
  db_instance_class = local.is_prod ? "db.t4g.medium" : "db.t4g.micro"
  db_multi_az       = local.is_prod ? true : false

  # https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_Storage.html#gp2-storage
  # Unit: GiB
  db_start_storage = local.is_prod ? 10 : 5
  db_max_storage   = local.is_prod ? 50 : 10

  # Unit: days
  db_backup_retention = local.is_prod ? 30 : 7
}
# resource "aws_db_subnet_group" "bloom" {
#   region     = var.aws_region
#   name       = "bloom"
#   subnet_ids = [for s in aws_subnet.bloom : s.id]
# }
# resource "aws_db_instance" "bloom" {
#   identifier                      = "bloom"
#   deletion_protection             = local.is_prod
#   engine                          = "postgres"
#   engine_version                  = "17"
#   instance_class                  = local.db_instance_class
#   multi_az                        = local.db_multi_az
#   enabled_cloudwatch_logs_exports = ["postgresql", "upgrade", "iam-db-auth-error"]
#   username                        = "master"
#   manage_master_user_password     = true
# 
#   # Networking
#   iam_database_authentication_enabled = true
#   db_subnet_group_name                = aws_db_subnet_group.bloom.id
# 
#   # Updates
#   apply_immediately           = true # If false, any changes are applied in the next maintenance window instead of when tofu apply runs.
#   engine_lifecycle_support    = "open-source-rds-extended-support"
#   allow_major_version_upgrade = false
#   auto_minor_version_upgrade  = true
# 
#   # Storage
#   storage_encrypted         = true
#   storage_type              = "gp2"
#   allocated_storage         = local.db_start_storage
#   max_allocated_storage     = local.db_max_storage
#   backup_retention_period   = local.db_backup_retention
#   final_snapshot_identifier = "bloom-db-finalsnapshot"
#   skip_final_snapshot       = !local.is_prod
# }
