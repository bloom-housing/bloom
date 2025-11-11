# Create a private subnets for ECS tasks with 256 addresses in each subnet. The ECS control-plane
# will take care of spreading tasks among the zones.
data "aws_availability_zones" "zones" {
  state = "available"
}
locals {
  # Create a map like:
  # {
  #  "us-east-1a" = "10.0.1.0/24"
  #  "us-east-1b" = "10.0.2.0/24"
  #  "us-east-1c" = "10.0.3.0/24"
  #  "us-east-1d" = "10.0.4.0/24"
  #  "us-east-1e" = "10.0.5.0/24"
  #  "us-east-1f" = "10.0.6.0/24"
  # }
  availability_zones_cidrs = zipmap(
    data.aws_availability_zones.zones.names,
    [for i in range(1, length(data.aws_availability_zones.zones.names) + 1) : "10.0.${i}.0/24"]
  )
}
resource "aws_vpc" "bloom" {
  region     = var.aws_region
  cidr_block = "10.0.0.0/16"
  tags = {
    Name = "bloom"
  }
}
resource "aws_subnet" "bloom" {
  for_each          = local.availability_zones_cidrs
  vpc_id            = aws_vpc.bloom.id
  availability_zone = each.key
  cidr_block        = each.value
  tags = {
    Name = "bloom-private-${each.key}"
  }
}

# Create public subnets for NAT gateways with 128 addresses in each subnet. For full redundancy we
# would need to provision a NAT gateway in each availability zone in the region. A NAT gateway has
# a baseline cost of ~$400 per year, however, so having two strikes a balance between cost while
# still having redundancy to a single becoming unavailable.
resource "aws_internet_gateway" "bloom" {
  vpc_id = aws_vpc.bloom.id
  tags = {
    Name = "bloom"
  }
}
locals {
  # Create a map like:
  # {
  #  "us-east-1a" = "10.0.0.0/25"
  #  "us-east-1b" = "10.0.0.128/25"
  # }
  nat_zones = slice(data.aws_availability_zones.zones.names, 0, 2)
  nat_cidrs = zipmap(
    local.nat_zones,
    cidrsubnets("10.0.0.0/23", [for _ in local.nat_zones : 2]...)
  )
}
resource "aws_subnet" "nat" {
  for_each                = local.nat_cidrs
  vpc_id                  = aws_vpc.bloom.id
  availability_zone       = each.key
  cidr_block              = each.value
  map_public_ip_on_launch = true
  tags = {
    Name = "bloom-nat-${each.key}"
  }
}
resource "aws_eip" "nat" {
  for_each = local.nat_cidrs
  region   = var.aws_region
  domain   = "vpc"
  tags = {
    Name = "bloom-nat-${each.key}"
  }
}
resource "aws_nat_gateway" "nat" {
  for_each          = local.nat_cidrs
  region            = var.aws_region
  subnet_id         = aws_subnet.nat[each.key].id
  connectivity_type = "public"
  allocation_id     = aws_eip.nat[each.key].allocation_id
  tags = {
    Name = "bloom-nat-${each.key}"
  }
  depends_on = [aws_internet_gateway.bloom]
}
