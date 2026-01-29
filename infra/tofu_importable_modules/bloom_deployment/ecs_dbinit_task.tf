resource "aws_ecs_task_definition" "bloom_dbinit" {
  region                   = var.aws_region
  family                   = "bloom-dbinit"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]

  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "X86_64"
  }

  execution_role_arn = aws_iam_role.bloom_ecs["dbinit"].arn
  task_role_arn      = aws_iam_role.bloom_container["dbinit"].arn

  cpu    = 512 # 0.5 vCPU
  memory = 512 # MiB

  container_definitions = jsonencode([
    {
      name  = "bloom-dbinit"
      image = var.bloom_dbinit_image

      secrets = [
        {
          name      = "PGPASSWORD"
          valueFrom = "${aws_db_instance.bloom.master_user_secret[0].secret_arn}:password::"
        }
      ]
      entryPoint = ["psql"]
      command = [
        "--host=${aws_db_instance.bloom.address}",
        "--port=5432",
        "--dbname=postgres",
        "--username=${aws_db_instance.bloom.username}",
        "--echo-queries",
        "--echo-hidden",
        "--file=rds.init.sql",
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-region"        = var.aws_region
          "awslogs-group"         = aws_cloudwatch_log_group.task_logs["bloom-dbinit"].name
          "awslogs-stream-prefix" = "bloom-dbinit"
        }
      }
    }
  ])

  depends_on = [
    aws_db_instance.bloom,
    aws_cloudwatch_log_group.task_logs,
  ]
}

resource "null_resource" "bloom_dbinit_run" {
  triggers = {
    task_definition_arn = aws_ecs_task_definition.bloom_dbinit.arn
    db_instance_id      = aws_db_instance.bloom.id
  }

  depends_on = [
    aws_db_instance.bloom,
    aws_vpc_endpoint.secrets_manager,
    aws_route_table_association.private_subnet,
  ]

  provisioner "local-exec" {
    interpreter = ["/usr/bin/env", "bash", "-c"]
    command     = <<-EOT
      set -euo pipefail

      echo "Starting Bloom dbinit task..."

      task_arn="$(
        aws ecs run-task \
          --profile ${var.aws_profile} \
          --region ${var.aws_region} \
          --cluster ${aws_ecs_cluster.bloom.arn} \
          --launch-type FARGATE \
          --task-definition ${aws_ecs_task_definition.bloom_dbinit.arn} \
          --network-configuration "awsvpcConfiguration={subnets=[${join(",", [for s in aws_subnet.private : s.id])}],securityGroups=[${aws_security_group.dbinit.id}],assignPublicIp=DISABLED}" \
          --query 'tasks[0].taskArn' \
          --output text
      )"

      if [ -z "$task_arn" ] || [ "$task_arn" = "None" ]; then
        echo "ERROR: failed to start Bloom dbinit task" >&2
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
        echo "ERROR: Bloom dbinit task failed (exitCode=$exit_code). stoppedReason=$reason" >&2
        exit 1
      fi

      echo "Bloom dbinit task succeeded."
    EOT
  }
}
