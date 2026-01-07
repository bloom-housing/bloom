# Network design:
#
# Provision a private and public subnet for each availability zone in the region. Only load
# balancers and NAT gateways are provisioned in the public subnets, everything else is provisioned
# in the private subnets. The Bloom ECS tasks need access to the internet so they can download their
# docker image and access their dependent services. Access is provided via NAT gateways. Access to
# AWS services is configured through AWS PrivateLink endpoints so that traffic stays in the AWS
# internal network rather than going over the internet.
#
# We get a /22 range (1,024 addresses total) and provision it into /26 blocks (64 addresses total,
# 59 usable [1]) for each subnet. This provisioning strategy supports up to 8 subnets in the region
# being deployed to. Assuming a base IP of 10.0.0.0, the subnet ranges will therefore be:
#
# cidr          | zone | type
# --------------|------|--------
# 10.0.0.0/26   |  a   | private
# 10.0.0.64/26  |  a   | public
# 10.0.0.128/26 |  b   | private
# 10.0.0.192/26 |  b   | public
# 10.0.1.0/26   |  c   | private
# 10.0.1.64/26  |  c   | public
# ...
#
# [1]:
#   From https://aws.amazon.com/vpc/faqs/:
#
#   > Amazon reserves the first four (4) IP addresses and the last one (1) IP address of every subnet for IP networking purposes.
#   > The minimum size of a subnet is a /28 (or 14 IP addresses.)
data "aws_availability_zones" "zones" {
  region = var.aws_region
  state  = "available"

  lifecycle {
    postcondition {
      # At the time of writing, the largest region is us-east-1 with 6 availability zones.
      condition     = length(self.names) <= 8
      error_message = "The IP provisioning strategy does not support more than 8 availability zones."
    }
  }
}
locals {
  zones = data.aws_availability_zones.zones.names
}
resource "aws_vpc" "bloom" {
  region               = var.aws_region
  cidr_block           = var.vpc_cidr_range
  enable_dns_support   = true
  enable_dns_hostnames = true
  tags = {
    Name = "bloom"
  }
}
locals {
  # VPC range is a /22, each subnet gets a /26
  newbits = 26 - 22

  # Take even index ranges.
  private_subnets = zipmap(
    local.zones,
    [for i in range(0, (length(local.zones) * 2) - 1, 2) : cidrsubnet(var.vpc_cidr_range, local.newbits, i)]
  )
  # Take odd index ranges.
  public_subnets = zipmap(
    local.zones,
    [for i in range(1, length(local.zones) * 2, 2) : cidrsubnet(var.vpc_cidr_range, local.newbits, i)]
  )
}
# What makes a AWS subnet public is a direct route to the internet. This is controlled through the
# route tables attached to each subnet. By default each route table has a 'local' route for cidr
# ranges used by the VPC. Add 'catch-all' route for 0.0.0.0/0 that routes to the VPC internet
# gateway.
resource "aws_internet_gateway" "bloom" {
  region = var.aws_region
  vpc_id = aws_vpc.bloom.id
}
resource "aws_subnet" "public" {
  for_each                = local.public_subnets
  vpc_id                  = aws_vpc.bloom.id
  availability_zone       = each.key
  cidr_block              = each.value
  map_public_ip_on_launch = false
  tags = {
    Name = "bloom-public-${each.key}"
  }
}
resource "aws_route_table" "internet_gateway" {
  region = var.aws_region
  vpc_id = aws_vpc.bloom.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.bloom.id
  }
  tags = {
    Name = "bloom-internet-gateway"
  }
}
resource "aws_route_table_association" "public_subnet" {
  for_each       = aws_subnet.public
  region         = var.aws_region
  subnet_id      = each.value.id
  route_table_id = aws_route_table.internet_gateway.id
}
# ECS tasks in the private subnets still need access to the internet. This is provided by a NAT
# gateway. A NAT gateway is a zonal resource so provision one in each availability zone. Each
# private subnet needs a route table with a similar 'catch-all' route, but instead of going to the
# VPC internet gateway, it goes to the NAT gateway in the zone.
resource "aws_eip" "nat" {
  for_each = aws_subnet.public
  region   = var.aws_region
  domain   = "vpc"
}
resource "aws_nat_gateway" "bloom" {
  for_each          = aws_subnet.public
  region            = var.aws_region
  connectivity_type = "public"
  subnet_id         = each.value.id
  allocation_id     = aws_eip.nat[each.key].id
  tags = {
    Name = "bloom-nat-${each.key}"
  }
}

# Create private subnets.
resource "aws_subnet" "private" {
  for_each                = local.private_subnets
  vpc_id                  = aws_vpc.bloom.id
  availability_zone       = each.key
  cidr_block              = each.value
  map_public_ip_on_launch = false
  tags = {
    Name = "bloom-private-${each.key}"
  }
}
resource "aws_route_table" "nat_gateway" {
  for_each = aws_subnet.private
  region   = var.aws_region
  vpc_id   = aws_vpc.bloom.id
  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.bloom[each.key].id
  }
  tags = {
    Name = "bloom-nat-gateway-${each.key}"
  }
}
resource "aws_route_table_association" "private_subnet" {
  for_each       = aws_subnet.private
  region         = var.aws_region
  subnet_id      = each.value.id
  route_table_id = aws_route_table.nat_gateway[each.key].id
}

# Create PrivateLink endpoints for AWS services to be accessed via. This keeps the traffic internal
# to AWS's network and avoids going through the NAT gateway over the internet.
resource "aws_vpc_endpoint" "secrets_manager" {
  region              = var.aws_region
  vpc_id              = aws_vpc.bloom.id
  vpc_endpoint_type   = "Interface"
  private_dns_enabled = true # required for the AWS SDKs to use this network path by default instead of through the public internet.
  service_name        = "com.amazonaws.${var.aws_region}.secretsmanager"
  subnet_ids          = [for s in aws_subnet.private : s.id]
  security_group_ids  = [aws_security_group.secrets_manager_endpoint.id]
  tags = {
    Name = "bloom-secretsmanager"
  }
}
resource "aws_security_group" "secrets_manager_endpoint" {
  region      = var.aws_region
  vpc_id      = aws_vpc.bloom.id
  name        = "secrets-manager-endpoint"
  description = "Rules for secrets manager vpc endpoint"
}
resource "aws_vpc_security_group_ingress_rule" "bloom_service_tasks" {
  for_each = {
    "api" = aws_security_group.api.id

    # If/when the sites need secrets:
    # "site-partners" = aws_security_group.site_partners.id
    # "site-public"   = aws_security_group.site_public.id
  }
  region                       = var.aws_region
  security_group_id            = aws_security_group.secrets_manager_endpoint.id
  referenced_security_group_id = each.value
  ip_protocol                  = "tcp"
  from_port                    = 443
  to_port                      = 443
  tags = {
    Name = "${each.key}-allow"
  }
}

# Create security group for database.
resource "aws_security_group" "db" {
  region      = var.aws_region
  vpc_id      = aws_vpc.bloom.id
  name        = "bloom-db"
  description = "Rules for Bloom database."
}
resource "aws_vpc_security_group_ingress_rule" "db" {
  region                       = var.aws_region
  security_group_id            = aws_security_group.db.id
  referenced_security_group_id = aws_security_group.api.id
  ip_protocol                  = "tcp"
  from_port                    = 5432
  to_port                      = 5432
  tags = {
    Name = "api-allow"
  }
}

# Create security group for LB.
resource "aws_security_group" "lb" {
  region      = var.aws_region
  vpc_id      = aws_vpc.bloom.id
  name        = "bloom-lb"
  description = "Rules for Bloom load balancer."
}
resource "aws_vpc_security_group_ingress_rule" "lb" {
  region            = var.aws_region
  security_group_id = aws_security_group.lb.id
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "tcp"
  from_port         = 443
  to_port           = 443
  tags = {
    Name = "internet-allow"
  }
}
resource "aws_vpc_security_group_egress_rule" "lb_to_partners_site" {
  region                       = var.aws_region
  security_group_id            = aws_security_group.lb.id
  referenced_security_group_id = aws_security_group.site_partners.id
  ip_protocol                  = "tcp"
  from_port                    = 3001
  to_port                      = 3001
  tags = {
    Name = "site-partners-allow"
  }
}
resource "aws_vpc_security_group_egress_rule" "lb_to_public_site" {
  region                       = var.aws_region
  security_group_id            = aws_security_group.lb.id
  referenced_security_group_id = aws_security_group.site_public.id
  ip_protocol                  = "tcp"
  from_port                    = 3000
  to_port                      = 3000
  tags = {
    Name = "site-public-allow"
  }
}

# Create security group for api ECS tasks.
resource "aws_security_group" "api" {
  region      = var.aws_region
  vpc_id      = aws_vpc.bloom.id
  name        = "bloom-api"
  description = "Rules for Bloom API tasks."
}
resource "aws_vpc_security_group_ingress_rule" "api" {
  for_each = {
    "site-partners" = aws_security_group.site_partners.id
    "site-public"   = aws_security_group.site_public.id
  }
  region                       = var.aws_region
  security_group_id            = aws_security_group.api.id
  referenced_security_group_id = each.value
  ip_protocol                  = "tcp"
  from_port                    = 3100
  to_port                      = 3100
  tags = {
    Name = "${each.key}-allow"
  }
}
resource "aws_vpc_security_group_egress_rule" "api_to_db" {
  region                       = var.aws_region
  security_group_id            = aws_security_group.api.id
  referenced_security_group_id = aws_security_group.db.id
  ip_protocol                  = "tcp"
  from_port                    = 5432
  to_port                      = 5432
  tags = {
    Name = "allow-db"
  }
}
resource "aws_vpc_security_group_egress_rule" "api_to_secretsmanager" {
  region                       = var.aws_region
  security_group_id            = aws_security_group.api.id
  referenced_security_group_id = aws_security_group.secrets_manager_endpoint.id
  ip_protocol                  = "tcp"
  from_port                    = 443
  to_port                      = 443
  tags = {
    Name = "allow-secretsmanager"
  }
}
resource "aws_vpc_security_group_egress_rule" "api_to_nat" {
  region            = var.aws_region
  security_group_id = aws_security_group.api.id
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "tcp"
  from_port         = 443
  to_port           = 443
  tags = {
    Name = "allow-nat-https"
  }
}

# Create security group for partners site ECS tasks.
resource "aws_security_group" "site_partners" {
  region      = var.aws_region
  vpc_id      = aws_vpc.bloom.id
  name        = "bloom-site-partners"
  description = "Rules for Bloom partners site tasks."
}
resource "aws_vpc_security_group_ingress_rule" "lb_to_site_partners" {
  region                       = var.aws_region
  security_group_id            = aws_security_group.site_partners.id
  referenced_security_group_id = aws_security_group.lb.id
  ip_protocol                  = "tcp"
  from_port                    = 3001
  to_port                      = 3001
  tags = {
    Name = "allow-lb"
  }
}
resource "aws_vpc_security_group_egress_rule" "site_partners_to_api" {
  region                       = var.aws_region
  security_group_id            = aws_security_group.site_partners.id
  referenced_security_group_id = aws_security_group.api.id
  ip_protocol                  = "tcp"
  from_port                    = 3100
  to_port                      = 3100
  tags = {
    Name = "allow-api"
  }
}
# If/when access to secrets manager is needed:
#resource "aws_vpc_security_group_egress_rule" "site_partners_to_secretsmanager" {
#  region                       = var.aws_region
#  security_group_id            = aws_security_group.site_partners.id
#  referenced_security_group_id = aws_security_group.secrets_manager_endpoint.id
#  ip_protocol                  = "tcp"
#  from_port                    = 443
#  to_port                      = 443
#  tags = {
#    Name = "allow-secretsmanager"
#  }
#}
resource "aws_vpc_security_group_egress_rule" "site_partners_to_nat" {
  region            = var.aws_region
  security_group_id = aws_security_group.site_partners.id
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "tcp"
  from_port         = 443
  to_port           = 443
  tags = {
    Name = "allow-nat-https"
  }
}

# Create security group for public site ECS tasks.
resource "aws_security_group" "site_public" {
  region      = var.aws_region
  vpc_id      = aws_vpc.bloom.id
  name        = "bloom-site-public"
  description = "Rules for Bloom public site tasks."
}
resource "aws_vpc_security_group_ingress_rule" "lb_to_site_public" {
  region                       = var.aws_region
  security_group_id            = aws_security_group.site_public.id
  referenced_security_group_id = aws_security_group.lb.id
  ip_protocol                  = "tcp"
  from_port                    = 3000
  to_port                      = 3000
  tags = {
    Name = "allow-lb"
  }
}
resource "aws_vpc_security_group_egress_rule" "site_public_to_api" {
  region                       = var.aws_region
  security_group_id            = aws_security_group.site_public.id
  referenced_security_group_id = aws_security_group.api.id
  ip_protocol                  = "tcp"
  from_port                    = 3100
  to_port                      = 3100
  tags = {
    Name = "allow-api"
  }
}
# If/when access to secrets manager is needed:
#resource "aws_vpc_security_group_egress_rule" "site_public_to_secretsmanager" {
#  region                       = var.aws_region
#  security_group_id            = aws_security_group.site_public.id
#  referenced_security_group_id = aws_security_group.secrets_manager_endpoint.id
#  ip_protocol                  = "tcp"
#  from_port                    = 443
#  to_port                      = 443
#  tags = {
#    Name = "allow-secretsmanager"
#  }
#}
resource "aws_vpc_security_group_egress_rule" "site_public_to_nat" {
  region            = var.aws_region
  security_group_id = aws_security_group.site_public.id
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "tcp"
  from_port         = 443
  to_port           = 443
  tags = {
    Name = "allow-nat-https"
  }
}
