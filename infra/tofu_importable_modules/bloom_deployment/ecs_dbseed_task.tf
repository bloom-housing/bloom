locals {
  dbseed_env_vars = {
    PORT                        = "3100"
    NODE_ENV                    = "production"
    DB_HOST                     = aws_db_instance.bloom.address
    DB_PORT                     = "5432"
    DB_USER                     = "bloom_api"
    DB_DATABASE                 = "bloom_prisma"
    DB_USE_RDS_IAM_AUTH         = "1"
    DBSEED_PUBLIC_SITE_BASE_URL = "https://${var.domain_name}"
  }
}

resource "aws_ecs_task_definition" "bloom_dbseed" {
  count = var.bloom_dbseed_image == "" ? 0 : 1

  region                   = var.aws_region
  family                   = "bloom-dbseed"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]

  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "X86_64"
  }

  execution_role_arn = aws_iam_role.bloom_ecs["dbseed"].arn
  task_role_arn      = aws_iam_role.bloom_container["dbseed"].arn

  cpu    = 1024     # 1 vCPU
  memory = 4 * 1024 # 4 GiB in MiB

  container_definitions = jsonencode([
    {
      name        = "bloom-dbseed"
      image       = var.bloom_dbseed_image
      environment = [for k, v in local.dbseed_env_vars : { name = k, value = v }]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-region"        = var.aws_region
          "awslogs-group"         = aws_cloudwatch_log_group.task_logs["bloom-dbseed"].name
          "awslogs-stream-prefix" = "bloom-dbseed"
        }
      }
    }
  ])
}

// Avoids the error :
//
// module.bloom_deployment.null_resource.bloom_dbseed_run (local-exec): An error occurred
// (ClientException) when calling the RunTask operation: ECS was unable to assume the role
// 'arn:aws:iam::x:role/bloom-dbseed-container' that was provided for this task.
resource "time_sleep" "on_dbseed_container_role_creation" {
  count = var.bloom_dbseed_image == "" ? 0 : 1

  depends_on = [
    aws_iam_role_policy.bloom_ecs["dbseed"],
    aws_iam_role_policy.bloom_container["dbseed"],
  ]
  create_duration = "30s"
}

# TODO: remove local exec provisioner once
# https://github.com/hashicorp/terraform-provider-aws/issues/29871 is implemented.
resource "null_resource" "bloom_dbseed_run" {
  count = var.bloom_dbseed_image == "" ? 0 : 1

  triggers = {
    run_number     = var.bloom_dbseed_run_number
    db_instance_id = aws_db_instance.bloom.id
  }

  depends_on = [
    aws_vpc_endpoint.secrets_manager,
    aws_route_table_association.private_subnet,
    time_sleep.on_dbseed_container_role_creation,
    null_resource.bloom_dbinit_run,
    aws_ecs_service.bloom_api, # need API to apply migrations before seed can run.
  ]

  provisioner "local-exec" {
    interpreter = ["/usr/bin/env", "bash", "-c"]
    command     = <<-EOT
      set -euo pipefail

      echo "Starting Bloom dbseed task..."

      task_arn="$(
        aws ecs run-task \
           ${var.aws_profile != "" ? "--profile ${var.aws_profile}" : ""} \
          --region ${var.aws_region} \
          --cluster ${aws_ecs_cluster.bloom.arn} \
          --launch-type FARGATE \
          --task-definition ${aws_ecs_task_definition.bloom_dbseed[0].arn} \
          --network-configuration "awsvpcConfiguration={subnets=[${join(",", [for s in aws_subnet.private : s.id])}],securityGroups=[${aws_security_group.dbseed[0].id}],assignPublicIp=DISABLED}" \
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
        ${var.aws_profile != "" ? "--profile ${var.aws_profile}" : ""} \
        --region ${var.aws_region} \
        --cluster ${aws_ecs_cluster.bloom.arn} \
        --tasks "$task_arn"

      exit_code="$(
        aws ecs describe-tasks \
          ${var.aws_profile != "" ? "--profile ${var.aws_profile}" : ""} \
          --region ${var.aws_region} \
          --cluster ${aws_ecs_cluster.bloom.arn} \
          --tasks "$task_arn" \
          --query 'tasks[0].containers[0].exitCode' \
          --output text
      )"

      if [ "$exit_code" != "0" ]; then
        reason="$(
          aws ecs describe-tasks \
            ${var.aws_profile != "" ? "--profile ${var.aws_profile}" : ""} \
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
