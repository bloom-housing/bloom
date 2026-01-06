# Security group for data explorer ECS tasks
resource "aws_security_group" "data_explorer" {
  region      = var.aws_region
  vpc_id      = var.vpc_id
  name        = "data-explorer-backend"
  description = "Rules for data explorer backend tasks."
}

# Allow Bloom API to access data explorer backend on port 8000
resource "aws_vpc_security_group_ingress_rule" "data_explorer_from_bloom_api" {
  region                       = var.aws_region
  security_group_id            = aws_security_group.data_explorer.id
  referenced_security_group_id = var.bloom_api_security_group_id
  ip_protocol                  = "tcp"
  from_port                    = 8000
  to_port                      = 8000
  tags = {
    Name = "bloom-api-allow"
  }
}

# Allow data explorer to access its database
resource "aws_vpc_security_group_egress_rule" "data_explorer_to_db" {
  region                       = var.aws_region
  security_group_id            = aws_security_group.data_explorer.id
  referenced_security_group_id = aws_security_group.data_explorer_db.id
  ip_protocol                  = "tcp"
  from_port                    = 5432
  to_port                      = 5432
  tags = {
    Name = "allow-db"
  }
}

# Allow data explorer to access secrets manager
resource "aws_vpc_security_group_egress_rule" "data_explorer_to_secretsmanager" {
  region                       = var.aws_region
  security_group_id            = aws_security_group.data_explorer.id
  referenced_security_group_id = var.secrets_manager_endpoint_security_group_id
  ip_protocol                  = "tcp"
  from_port                    = 443
  to_port                      = 443
  tags = {
    Name = "allow-secretsmanager"
  }
}

# Allow data explorer to access internet via NAT gateway (for GCP API calls, etc.)
resource "aws_vpc_security_group_egress_rule" "data_explorer_to_nat" {
  region            = var.aws_region
  security_group_id = aws_security_group.data_explorer.id
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "tcp"
  from_port         = 443
  to_port           = 443
  tags = {
    Name = "allow-nat-https"
  }
}

# Add ingress rule to secrets manager endpoint security group for data explorer
resource "aws_vpc_security_group_ingress_rule" "secrets_manager_from_data_explorer" {
  region                       = var.aws_region
  security_group_id            = var.secrets_manager_endpoint_security_group_id
  referenced_security_group_id = aws_security_group.data_explorer.id
  ip_protocol                  = "tcp"
  from_port                    = 443
  to_port                      = 443
  tags = {
    Name = "data-explorer-allow"
  }
}

# Add egress rule to Bloom API security group to allow it to reach data explorer
resource "aws_vpc_security_group_egress_rule" "bloom_api_to_data_explorer" {
  region                       = var.aws_region
  security_group_id            = var.bloom_api_security_group_id
  referenced_security_group_id = aws_security_group.data_explorer.id
  ip_protocol                  = "tcp"
  from_port                    = 8000
  to_port                      = 8000
  tags = {
    Name = "allow-data-explorer"
  }
}