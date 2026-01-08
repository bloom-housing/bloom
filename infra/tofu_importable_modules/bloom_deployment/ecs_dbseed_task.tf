locals {
  default_env_vars = {
    NODE_ENV = "production"
    DB_USER  = aws_db_instance.bloom.username
    DB_HOST  = aws_db_instance.bloom.endpoint
  }
}

resource "aws_ecs_task_definition" "bloom_dbseed" {
  count                    = var.apply_seed ? 1 : 0
  region                   = var.aws_region
  family                   = "bloom-dbseed"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]

  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "X86_64"
  }

  execution_role_arn = aws_iam_role.bloom_ecs["api"].arn
  task_role_arn      = aws_iam_role.bloom_container["api"].arn

  cpu    = 256
  memory = 512

  container_definitions = jsonencode([
    {
      name  = "bloom-dbseed"
      image = var.bloom_dbseed_image

      command = [
        "/bin/bash",
        "-c",
        "export DATABASE_URL=postgres://$DB_USER:$(node -e 'console.log(encodeURIComponent(process.argv[1]))' $DB_PASSWORD)@$DB_HOST/bloomprisma && yarn db:seed:staging",
      ]

      secrets = [
        {
          name      = "DB_PASSWORD"
          valueFrom = "${aws_db_instance.bloom.master_user_secret[0].secret_arn}:password::"
        }
      ]

      environment = [
        for k, v in local.default_env_vars : { name = k, value = v }
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-region"        = var.aws_region
          "awslogs-group"         = aws_cloudwatch_log_group.task_logs["bloom-api"].name
          "awslogs-stream-prefix" = "bloom-dbseed"
        }
      }
    }
  ])

  depends_on = [
    aws_db_instance.bloom,
    aws_cloudwatch_log_group.task_logs,
  ]
}

resource "null_resource" "bloom_dbseed_run" {
  count = var.apply_seed ? 1 : 0

  triggers = {
    task_definition_arn = aws_ecs_task_definition.bloom_dbseed[0].arn
    db_instance_id      = aws_db_instance.bloom.id
    apply_seed          = var.apply_seed ? "true" : "false"
  }

  depends_on = [
    aws_db_instance.bloom,
    aws_vpc_endpoint.secrets_manager,
    aws_route_table_association.private_subnet,
    aws_ecs_service.bloom_api,
  ]

  provisioner "local-exec" {
    interpreter = ["/usr/bin/env", "bash", "-c"]
    command = <<-EOT
      set -euo pipefail

      echo "Starting Bloom dbseed task..."

      task_arn="$(
        aws ecs run-task \
          --profile ${var.aws_profile} \
          --region ${var.aws_region} \
          --cluster ${aws_ecs_cluster.bloom.arn} \
          --launch-type FARGATE \
          --task-definition ${aws_ecs_task_definition.bloom_dbseed[0].arn} \
          --network-configuration "awsvpcConfiguration={subnets=[${join(",", [for s in aws_subnet.private : s.id])}],securityGroups=[${aws_security_group.api.id}],assignPublicIp=DISABLED}" \
          --query 'tasks[0].taskArn' \
          --output text
      )"

      if [ -z "$task_arn" ] || [ "$task_arn" = "None" ]; then
        echo "ERROR: failed to start Bloom dbseed task" >&2
        exit 1
      fi

      echo "Task ARN: $task_arn"
      echo "Waiting for task to stop..."
      aws ecs wait tasks-stopped \
        --profile ${var.aws_profile} \
        --region ${var.aws_region} \
        --cluster ${aws_ecs_cluster.bloom.arn} \
        --tasks "$task_arn"

      exit_code="$(
        aws ecs describe-tasks \
          --profile ${var.aws_profile} \
          --region ${var.aws_region} \
          --cluster ${aws_ecs_cluster.bloom.arn} \
          --tasks "$task_arn" \
          --query 'tasks[0].containers[0].exitCode' \
          --output text
      )"

      if [ "$exit_code" != "0" ]; then
        reason="$(
          aws ecs describe-tasks \
            --profile ${var.aws_profile} \
            --region ${var.aws_region} \
            --cluster ${aws_ecs_cluster.bloom.arn} \
            --tasks "$task_arn" \
            --query 'tasks[0].stoppedReason' \
            --output text
        )"
        echo "ERROR: Bloom dbseed task failed (exitCode=$exit_code). stoppedReason=$reason" >&2
        exit 1
      fi

      echo "Bloom dbseed task succeeded."
    EOT
  }
}
