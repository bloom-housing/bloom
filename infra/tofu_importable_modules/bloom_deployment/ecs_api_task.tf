locals {
  api_default_env_vars = {
    PORT     = "3100"
    NODE_ENV = "production"
    DB_USER  = aws_db_instance.bloom.username
    DB_HOST  = aws_db_instance.bloom.endpoint
  }
}
resource "aws_ecs_task_definition" "bloom_api" {
  region                   = var.aws_region
  family                   = "bloom-api"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "X86_64"
  }

  execution_role_arn = aws_iam_role.bloom_ecs["api"].arn
  task_role_arn      = aws_iam_role.bloom_container["api"].arn

  # https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definition_parameters.html#task_size
  cpu    = 1024     # 1 vCPU
  memory = 2 * 1024 # 2 GiB in MiB

  container_definitions = jsonencode([
    {
      Name  = "bloom-api"
      image = var.bloom_api_image
      command = [
        "/bin/bash",
        "-c",
        "export DATABASE_URL=postgres://$DB_USER:$(node -e 'console.log(encodeURIComponent(process.argv[1]))' $DB_PASSWORD)@$DB_HOST/bloomprisma && env && yarn db:migration:run && yarn start:prod",
      ]
      secrets = [
        {
          # TODO: replace with IAM authentication https://github.com/bloom-housing/bloom/issues/5451
          name = "DB_PASSWORD"
          # The master_user_secret tofu attribute is a block, so it is exposed as a list even though
          # there is only one element.
          #
          # The RDS managed secret has a username key and a password key. Docs for how to read
          # a specific key out of a secret:
          # https://docs.aws.amazon.com/AmazonECS/latest/developerguide/secrets-envvar-secrets-manager.html#secrets-envvar-secrets-manager-update-container-definition
          valueFrom = "${aws_db_instance.bloom.master_user_secret[0].secret_arn}:password::"
        },
        {
          name      = "APP_SECRET",
          valueFrom = aws_secretsmanager_secret.api_jwt_signing_key.arn
        }
      ]
      environment = [for k, v in merge(local.api_default_env_vars, var.bloom_api_env_vars) : { name = k, value = v }]
      portMappings = [
        {
          name          = "http"
          appProtocol   = "http"
          containerPort = 3100
        }
      ]
      restartPolicy = {
        enabled = false
      }
      healthCheck = {
        command = [
          "curl",
          "--fail",
          "http://127.0.0.1:3100/"
        ]
        interval    = 5 # seconds
        timeout     = 2 # seconds
        retries     = 10
        startPeriod = 5 # seconds
      }
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-region"        = var.aws_region
          "awslogs-group"         = aws_cloudwatch_log_group.task_logs["bloom-api"].name
          "awslogs-stream-prefix" = "bloom-api"
        }
      }
    }
  ])
}
resource "aws_ecs_service" "bloom_api" {
  depends_on = [
    aws_db_instance.bloom,
    aws_vpc_endpoint.secrets_manager,
    aws_route_table_association.private_subnet,
  ]
  wait_for_steady_state         = true # if tofu waits for the triggered deployment to complete.
  region                        = var.aws_region
  cluster                       = aws_ecs_cluster.bloom.arn
  name                          = "bloom-api"
  force_delete                  = true # allow deletion of the service without scaling down tasks to 0 first.
  task_definition               = aws_ecs_task_definition.bloom_api.arn
  launch_type                   = "FARGATE"
  scheduling_strategy           = "REPLICA"
  availability_zone_rebalancing = "ENABLED"
  desired_count                 = local.bloom_api_task_count
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

  network_configuration {
    security_groups  = [aws_security_group.api.id]
    subnets          = [for s in aws_subnet.private : s.id]
    assign_public_ip = false
  }
  service_connect_configuration {
    enabled   = true
    namespace = aws_service_discovery_http_namespace.bloom.arn
    service {
      port_name = "http"
      client_alias {
        dns_name = "bloom-api"
        port     = 3100
      }
      discovery_name = "bloom-api"
      timeout {
        idle_timeout_seconds        = 0 # disable idleTimeout
        per_request_timeout_seconds = 60
      }
    }
    log_configuration {
      log_driver = "awslogs"
      options = {
        "awslogs-region"        = var.aws_region
        "awslogs-group"         = aws_cloudwatch_log_group.task_logs["bloom-api"].name
        "awslogs-stream-prefix" = "service-connect-proxy"
      }
    }
  }
}
