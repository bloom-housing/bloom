# Create CloudWatch log group for task logs
resource "aws_cloudwatch_log_group" "data_explorer" {
  region            = var.aws_region
  name              = "data-explorer-backend"
  log_group_class   = "STANDARD"
  retention_in_days = local.ecs_logs_retention_days
}

# IAM role for ECS task execution (pulling images, writing logs, reading secrets)
resource "aws_iam_role" "data_explorer_ecs" {
  name        = "data-explorer-backend-ecs"
  description = "Role the ECS service uses when launching data explorer backend tasks."
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "ecs-tasks.amazonaws.com"
      }
      Condition = {
        ArnLike = {
          "aws:SourceArn" = "arn:aws:ecs:${var.aws_region}:${var.aws_account_number}:*"
        }
        StringEquals = {
          "aws:SourceAccount" = var.aws_account_number
        }
      }
    }]
  })
}

resource "aws_iam_role_policy" "data_explorer_ecs" {
  name = "data-explorer-backend-ecs"
  role = aws_iam_role.data_explorer_ecs.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = concat(
      [
        {
          Action = [
            "logs:CreateLogStream",
            "logs:PutLogEvents",
          ]
          Effect   = "Allow"
          Resource = "${aws_cloudwatch_log_group.data_explorer.arn}:log-stream:*"
        },
        {
          Action   = "secretsmanager:GetSecretValue"
          Effect   = "Allow"
          Resource = aws_db_instance.data_explorer.master_user_secret[0].secret_arn
        },
        {
          Action   = "secretsmanager:GetSecretValue"
          Effect   = "Allow"
          Resource = aws_secretsmanager_secret.api_key.arn
        }
      ],
      length(trimspace(var.vertex_credentials_json_secret_arn)) > 0 ? [
        {
          Action   = "secretsmanager:GetSecretValue"
          Effect   = "Allow"
          Resource = var.vertex_credentials_json_secret_arn
        }
      ] : []
    )
  })
}

# IAM role for the running container (minimal permissions)
resource "aws_iam_role" "data_explorer_container" {
  name        = "data-explorer-backend-container"
  description = "Role the data explorer backend container runs as."
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "ecs-tasks.amazonaws.com"
      }
      Condition = {
        ArnLike = {
          "aws:SourceArn" = "arn:aws:ecs:${var.aws_region}:${var.aws_account_number}:*"
        }
        StringEquals = {
          "aws:SourceAccount" = var.aws_account_number
        }
      }
    }]
  })
}

resource "aws_iam_role_policy" "data_explorer_container" {
  name = "data-explorer-backend-container"
  role = aws_iam_role.data_explorer_container.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action   = "*"
      Effect   = "Deny"
      Resource = "*"
    }]
  })
}

# Local variables for default environment variables
locals {
  # Endpoint format is "host:port"
  db_host = aws_db_instance.data_explorer.endpoint

  default_env_vars = {
    CORS           = var.cors_origins
    AI_PROVIDER    = var.ai_provider
    GCP_PROJECT_ID = var.gcp_project_id
    GCP_LOCATION   = var.gcp_location
    LOG_LEVEL      = "INFO"
  }

  container_secrets = concat(
    [
      {
        name      = "DB_PASSWORD"
        valueFrom = "${aws_db_instance.data_explorer.master_user_secret[0].secret_arn}:password::"
      },
      {
        name      = "API_KEY"
        valueFrom = aws_secretsmanager_secret.api_key.arn
      }
    ],
    length(trimspace(var.vertex_credentials_json_secret_arn)) > 0 ? [
      {
        name      = "VERTEX_CREDENTIALS_JSON"
        valueFrom = var.vertex_credentials_json_secret_arn
      }
    ] : []
  )
}

# ECS Task Definition
resource "aws_ecs_task_definition" "data_explorer" {
  region                   = var.aws_region
  family                   = "data-explorer-backend"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "X86_64"
  }

  execution_role_arn = aws_iam_role.data_explorer_ecs.arn
  task_role_arn      = aws_iam_role.data_explorer_container.arn

  # https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definition_parameters.html#task_size
  cpu    = 512      # 0.5 vCPU
  memory = 1 * 1024 # 1 GiB in MiB

  container_definitions = jsonencode([
    {
      name  = "data-explorer-backend"
      image = var.data_explorer_backend_image
      command = [
        "/bin/bash",
        "-c",
        # Construct DATABASE_URL from components, URL-encoding the password
        # Format: postgresql+psycopg://user:password@host:port/dbname
        "export DATABASE_URL=\"postgresql+psycopg://${aws_db_instance.data_explorer.username}:$(echo $DB_PASSWORD | sed 's|%|%25|g; s| |%20|g; s|&|%26|g; s|/|%2F|g; s|:|%3A|g; s|=|%3D|g; s|?|%3F|g; s|@|%40|g; s|\\[|%5B|g; s|]|%5D|g')@${local.db_host}/${local.db_name}\" && exec uvicorn main:app --host 0.0.0.0 --port 8000",
      ]
      secrets = local.container_secrets
      environment = [for k, v in merge(local.default_env_vars, var.data_explorer_env_vars) : { name = k, value = tostring(v) }]
      portMappings = [
        {
          name          = "http"
          appProtocol   = "http"
          containerPort = 8000
        }
      ]
      restartPolicy = {
        enabled = false
      }
      healthCheck = {
        command = [
          "CMD-SHELL",
          "curl --fail http://127.0.0.1:8000/health || exit 1"
        ]
        interval    = 30 # seconds
        timeout     = 5  # seconds
        retries     = 3
        startPeriod = 10 # seconds
      }
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-region"        = var.aws_region
          "awslogs-group"         = aws_cloudwatch_log_group.data_explorer.name
          "awslogs-stream-prefix" = "data-explorer-backend"
        }
      }
    }
  ])
}

# ECS Service
resource "aws_ecs_service" "data_explorer" {
  depends_on = [
    aws_db_instance.data_explorer,
    null_resource.data_explorer_db_bootstrap_run
  ]
  wait_for_steady_state         = true
  region                        = var.aws_region
  cluster                       = var.ecs_cluster_arn
  name                          = "data-explorer-backend"
  force_delete                  = true
  task_definition               = aws_ecs_task_definition.data_explorer.arn
  launch_type                   = "FARGATE"
  scheduling_strategy           = "REPLICA"
  availability_zone_rebalancing = "ENABLED"
  desired_count                 = local.task_count
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
  deployment_maximum_percent = 200

  network_configuration {
    security_groups  = [aws_security_group.data_explorer.id]
    subnets          = var.private_subnet_ids
    assign_public_ip = false
  }
  service_connect_configuration {
    enabled   = true
    namespace = var.service_discovery_namespace_arn
    service {
      port_name = "http"
      client_alias {
        dns_name = "data-explorer-backend"
        port     = 8000
      }
      discovery_name = "data-explorer-backend"
      timeout {
        idle_timeout_seconds        = 0 # disable idleTimeout
        per_request_timeout_seconds = 60
      }
    }
    log_configuration {
      log_driver = "awslogs"
      options = {
        "awslogs-region"        = var.aws_region
        "awslogs-group"         = aws_cloudwatch_log_group.data_explorer.name
        "awslogs-stream-prefix" = "service-connect-proxy"
      }
    }
  }
}