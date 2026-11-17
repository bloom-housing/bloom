locals {
  site_partners_default_env_vars = {
    NODE_ENV                    = "production"
    DISABLE_NEXT_TYPECHECK      = "TRUE"
    NEXTJS_PORT                 = "3001"
    BACKEND_API_BASE            = "http://bloom-api:3100"
    LISTINGS_QUERY              = "/listings"
    USE_SECURE_DOWNLOAD_PATHWAY = "TRUE"
    USE_S3_FILE_STORAGE         = "TRUE"
  }
}
resource "aws_ecs_task_definition" "bloom_site_partners" {
  region                   = var.aws_region
  family                   = "bloom-site-partners"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "X86_64"
  }

  execution_role_arn = aws_iam_role.bloom_ecs["site-partners"].arn
  task_role_arn      = aws_iam_role.bloom_container["site-partners"].arn

  cpu    = var.bloom_site_partners_resource_limits.vcpu
  memory = var.bloom_site_partners_resource_limits.memory_mib

  container_definitions = jsonencode(concat([
    {
      Name        = "bloom-site-partners"
      essential   = true
      image       = var.bloom_site_partners_image
      environment = [for k, v in merge(local.site_partners_default_env_vars, var.bloom_site_partners_env_vars) : { name = k, value = v }]
      secrets = [
        {
          name      = "MAPBOX_TOKEN",
          valueFrom = aws_secretsmanager_secret.mapbox_api_key.arn
        }
      ]
      portMappings = [
        {
          containerPort = 3001
          appProtocol   = "http"
        }
      ]
      restartPolicy = {
        enabled = false
      }
      healthCheck = {
        command = [
          "curl",
          "--fail",
          "http://127.0.0.1:3001/"
        ]
        interval    = 5 # seconds
        timeout     = 2 # seconds
        retries     = 10
        startPeriod = 60 # takes about 30s to start up, pad with 2x
      }

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-region"        = var.aws_region
          "awslogs-group"         = aws_cloudwatch_log_group.task_logs["bloom-site-partners"].name
          "awslogs-stream-prefix" = "bloom-site-partners"
        }
      }
    }
    ],
    local.otel_sidecar_container
  ))
}
resource "aws_ecs_service" "bloom_site_partners" {
  depends_on = [
    aws_ecs_service.bloom_api,
    aws_route_table_association.private_subnet,
    null_resource.bloom_dbseed_run,
  ]

  region                = var.aws_region
  cluster               = aws_ecs_cluster.bloom.arn
  name                  = "bloom-site-partners"
  force_delete          = true # allow deletion of the service without scaling down tasks to 0 first.
  task_definition       = aws_ecs_task_definition.bloom_site_partners.arn
  wait_for_steady_state = true
  desired_count         = var.service_task_autoscaling_config.partners_service_min_tasks

  lifecycle {
    ignore_changes = [desired_count] # tells terraform to ignore changes to desired_count so it does not fight with the auto scaler
  }

  deployment_configuration {
    strategy = "ROLLING"
  }

  deployment_circuit_breaker {
    enable   = true
    rollback = true
  }

  deployment_controller {
    type = "ECS"
  }

  network_configuration {
    security_groups  = [aws_security_group.bloom["site-partners"].id]
    subnets          = [for s in aws_subnet.private : s.id]
    assign_public_ip = false
  }

  service_connect_configuration {
    enabled   = true
    namespace = aws_service_discovery_http_namespace.bloom.arn
    log_configuration {
      log_driver = "awslogs"
      options = {
        "awslogs-region"        = var.aws_region
        "awslogs-group"         = aws_cloudwatch_log_group.task_logs["bloom-site-partners"].name
        "awslogs-stream-prefix" = "service-connect-proxy"
      }
    }
  }

  load_balancer {
    target_group_arn = module.alb.aws_lb_target_group_site_partners_arn
    container_name   = "bloom-site-partners"
    container_port   = 3001
  }

  health_check_grace_period_seconds = 500 # seconds, how long the LB will wait before considering a new task unhealthy.

  launch_type                   = "FARGATE"
  scheduling_strategy           = "REPLICA"
  availability_zone_rebalancing = "ENABLED"

}

resource "aws_appautoscaling_target" "bloom_site_partners_autoscaling_target" {
  max_capacity       = var.service_task_autoscaling_config.partners_service_max_tasks
  min_capacity       = var.service_task_autoscaling_config.partners_service_min_tasks
  resource_id        = "service/${aws_ecs_cluster.bloom.name}/${aws_ecs_service.bloom_site_partners.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

resource "aws_appautoscaling_policy" "bloom_site_partners_appautoscaling_policy_request_cpu" {
  name               = "${aws_ecs_service.bloom_site_partners.name}-request-scaling"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.bloom_site_partners_autoscaling_target.resource_id
  scalable_dimension = aws_appautoscaling_target.bloom_site_partners_autoscaling_target.scalable_dimension
  service_namespace  = aws_appautoscaling_target.bloom_site_partners_autoscaling_target.service_namespace

  target_tracking_scaling_policy_configuration {
    target_value = var.service_task_autoscaling_config.cpu_target

    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }

    scale_in_cooldown  = 300 # Wait 5 minutes before scaling in
    scale_out_cooldown = 60  # Wait 1 minute before scaling out
  }
}

# Scale based on memory utilization
resource "aws_appautoscaling_policy" "bloom_site_partners_appautoscaling_policy_request_memory" {
  name               = "${aws_ecs_service.bloom_site_partners.name}-memory-request-scaling"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.bloom_site_partners_autoscaling_target.resource_id
  scalable_dimension = aws_appautoscaling_target.bloom_site_partners_autoscaling_target.scalable_dimension
  service_namespace  = aws_appautoscaling_target.bloom_site_partners_autoscaling_target.service_namespace

  target_tracking_scaling_policy_configuration {
    target_value = var.service_task_autoscaling_config.memory_target

    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageMemoryUtilization"
    }

    scale_in_cooldown  = 300
    scale_out_cooldown = 60
  }
}
