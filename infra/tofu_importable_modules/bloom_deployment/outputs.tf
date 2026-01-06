output "vpc_id" {
  value       = aws_vpc.bloom.id
  description = "ID of the Bloom VPC."
}

output "private_subnet_ids" {
  value       = [for s in aws_subnet.private : s.id]
  description = "IDs of private subnets in the Bloom VPC."
}

output "ecs_cluster_arn" {
  value       = aws_ecs_cluster.bloom.arn
  description = "ARN of the Bloom ECS cluster."
}

output "service_discovery_namespace_arn" {
  value       = aws_service_discovery_http_namespace.bloom.arn
  description = "ARN of the service discovery namespace."
}

output "security_group_ids" {
  value = {
    api                      = aws_security_group.api.id
    secrets_manager_endpoint = aws_security_group.secrets_manager_endpoint.id
  }
  description = "Security group IDs for Bloom components."
}