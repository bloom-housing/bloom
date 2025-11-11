# Create an ECS cluster and services for each Bloom binary.
resource "aws_ecs_cluster" "bloom" {
  region = var.aws_region
  name   = "bloom"
}

# API service.
resource "aws_iam_role" "bloom_api" {
  name        = "bloom-api-container"
  description = "Role the Bloom API ECS container runs as."
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = ""
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
      }
    ]
  })
}
resource "aws_iam_role_policy" "bloom_api" {
  name = "bloom-api-container"
  role = aws_iam_role.bloom_api.id
  policy = jsonencode({
    Version   = "2012-10-17"
    Statement = []
  })
}
resource "aws_ecs_task_definition" "bloom_api" {
  region                   = var.aws_region
  family                   = "bloom-api"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  runtime_platform {
  }
  task_role_arn = aws_iam_role.bloom_api.arn
  container_definitions = jsonencode([
  ])
}

# partners site service

# public site service
