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
