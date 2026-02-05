locals {
  site_partners_default_env_vars = {
    NODE_ENV         = "production"
    NEXTJS_PORT      = "3001"
    BACKEND_API_BASE = "http://bloom-api:3100"
    LISTINGS_QUERY   = "/listings"
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

  # https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definition_parameters.html#task_size
  cpu    = 2048     # 2 vCPU
  memory = 4 * 1024 # 4 GiB in MiB

  container_definitions = jsonencode([
    {
      Name        = "bloom-site-partners"
      image       = var.bloom_site_partners_image
      environment = [for k, v in merge(local.site_partners_default_env_vars, var.bloom_site_partners_env_vars) : { name = k, value = v }]
      portMappings = [
        {
          containerPort = 3001
          appProtocol   = "http"
        }
      ]
      restartPolicy = {
        enabled = false
      }
      # TODO healthCheck https://github.com/bloom-housing/bloom/issues/5583
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-region"        = var.aws_region
          "awslogs-group"         = aws_cloudwatch_log_group.task_logs["bloom-site-partners"].name
          "awslogs-stream-prefix" = "bloom-site-partners"
        }
      }
    }
  ])
}
resource "aws_ecs_service" "bloom_site_partners" {
  depends_on = [
    aws_ecs_service.bloom_api,
    aws_route_table_association.private_subnet,
  ]
  region                = var.aws_region
  cluster               = aws_ecs_cluster.bloom.arn
  name                  = "bloom-site-partners"
  force_delete          = true # allow deletion of the service without scaling down tasks to 0 first.
  task_definition       = aws_ecs_task_definition.bloom_site_partners.arn
  wait_for_steady_state = true

  network_configuration {
    security_groups  = [aws_security_group.site_partners.id]
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
    target_group_arn = aws_lb_target_group.site_partners.arn
    container_name   = "bloom-site-partners"
    container_port   = 3001
  }
  health_check_grace_period_seconds = 500 # seconds, how long the LB will wait before considering a new task unhealthy.

  launch_type                   = "FARGATE"
  scheduling_strategy           = "REPLICA"
  availability_zone_rebalancing = "ENABLED"
  desired_count                 = local.bloom_site_partners_task_count
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
  deployment_maximum_percent = 200 # allow surge of up to twice desired task count.
}
