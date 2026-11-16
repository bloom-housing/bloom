moved {
  from = aws_iam_service_linked_role.ecs
  to   = module.ecs_cluster.aws_iam_service_linked_role.ecs
}

moved {
  from = aws_ecs_cluster.bloom
  to   = module.ecs_cluster.aws_ecs_cluster.bloom
}

moved {
  from = aws_service_discovery_http_namespace.bloom
  to   = module.ecs_cluster.aws_service_discovery_http_namespace.bloom
}

moved {
  from = aws_cloudwatch_log_group.task_logs
  to   = module.ecs_cluster.aws_cloudwatch_log_group.task_logs
}

moved {
  from = aws_secretsmanager_secret.api_jwt_signing_key
  to   = module.secretsmanager.aws_secretsmanager_secret.api_jwt_signing_key
}

moved {
  from = aws_iam_role.bloom_ecs
  to   = module.ecs_cluster.aws_iam_role.bloom_ecs
}

moved {
  from = aws_iam_role_policy.bloom_ecs
  to   = module.ecs_cluster.aws_iam_role_policy.bloom_ecs
}

moved {
  from = aws_iam_role.bloom_container
  to   = module.ecs_cluster.aws_iam_role.bloom_container
}

moved {
  from = aws_iam_role_policy.bloom_container
  to   = module.ecs_cluster.aws_iam_role_policy.bloom_container
}
