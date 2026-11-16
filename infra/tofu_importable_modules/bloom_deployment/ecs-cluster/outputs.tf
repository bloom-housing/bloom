output "arn" {
  value = aws_ecs_cluster.bloom.arn
}

output "cluster_name" {
  value = aws_ecs_cluster.bloom.name
}

output "aws_iam_role_bloom_container_arns" {
  value = { for key, ecs in aws_iam_role.bloom_container : key => ecs.arn }
}

output "bloom_container_role_policies" {
  value = aws_iam_role_policy.bloom_container
}

output "aws_iam_role_bloom_ecs_arns" {
  value = { for key, ecs in aws_iam_role.bloom_ecs : key => ecs.arn }
}

output "bloom_ecs_role_policies" {
  value = aws_iam_role_policy.bloom_ecs
}

output "aws_task_log_group_arns" {
  value       = { for key, lg in aws_cloudwatch_log_group.task_logs : key => lg.arn }
  description = "Map of log group key to CloudWatch log group arn"
}

output "aws_task_log_group_names" {
  value       = { for key, lg in aws_cloudwatch_log_group.task_logs : key => lg.name }
  description = "Map of log group key (e.g. \"bloom-api\") to CloudWatch log group name"
}

output "aws_service_discovery_http_namespace_arn" {
  value       = aws_service_discovery_http_namespace.bloom.arn
  description = "TODO"
}
