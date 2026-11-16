
locals {
  roles = merge({
    "dbinit" = {
      task_execution_policy_extra_statements = [
        {
          Action   = "secretsmanager:GetSecretValue"
          Effect   = "Allow"
          Resource = one([for s in var.aws_db_master_user_secrets : s.secret_arn if s.secret_status == "active"])
        },
      ]
      container_policy = jsonencode({
        Version = "2012-10-17"
        Statement = [{
          Action   = "*"
          Effect   = "Deny"
          Resource = "*"
        }]
      })
    }
    "api" = {
      task_execution_policy_extra_statements = [
        {
          Action   = "secretsmanager:GetSecretValue"
          Effect   = "Allow"
          Resource = var.secretsmanager_api_jwt_signing_key_arn
        },
        {
          Action   = "secretsmanager:GetSecretValue"
          Effect   = "Allow"
          Resource = var.secretsmanager_google_translate_api_key_arn
        }
      ]
      container_policy = jsonencode({
        Version = "2012-10-17"
        Statement = [
          {
            Action   = "rds-db:connect"
            Effect   = "Allow"
            Resource = "arn:aws:rds-db:${var.aws_region}:${var.aws_account_number}:dbuser:${var.aws_db_instance_id}/bloom_api"
          },
          {
            Action   = "ses:SendEmail"
            Effect   = "Allow"
            Resource = "arn:aws:ses:${var.aws_region}:${var.aws_account_number}:identity/*"
          },
          {
            Action   = "aps:RemoteWrite"
            Effect   = "Allow"
            Resource = var.aws_prometheus_workspace_arn
          },
          {
            Action   = "sms-voice:SendTextMessage"
            Effect   = "Allow"
            Resource = "arn:aws:sms-voice:${var.aws_region}:${var.aws_account_number}:phone-number/*"
          },
        ]
      })
    }
    "site-partners" = {
      task_execution_policy_extra_statements = [
        {
          Action   = "secretsmanager:GetSecretValue"
          Effect   = "Allow"
          Resource = var.secretsmanager_mapbox_api_key_arn
        }
      ]
      container_policy = jsonencode({
        Version = "2012-10-17"
        Statement = [{
          Action   = "aps:RemoteWrite"
          Effect   = "Allow"
          Resource = var.aws_prometheus_workspace_arn
        }]
      })
    }
    "site-public" = {
      task_execution_policy_extra_statements = [
        {
          Action   = "secretsmanager:GetSecretValue"
          Effect   = "Allow"
          Resource = var.secretsmanager_mapbox_api_key_arn
        }
      ]
      container_policy = jsonencode({
        Version = "2012-10-17"
        Statement = [{
          Action   = "aps:RemoteWrite"
          Effect   = "Allow"
          Resource = var.aws_prometheus_workspace_arn
        }]
      })
    }
    }, var.bloom_dbseed_image == "" ? {} : {
    "dbseed" = {
      task_execution_policy_extra_statements = []
      container_policy = jsonencode({
        Version = "2012-10-17"
        Statement = [{
          Action   = "rds-db:connect"
          Effect   = "Allow"
          Resource = "arn:aws:rds-db:${var.aws_region}:${var.aws_account_number}:dbuser:${var.aws_db_instance_id}/bloom_api"
        }]
      })
    }
  })
}

# Create roles for the ECS task executor and the tasks.
resource "aws_iam_role" "bloom_ecs" {
  for_each    = local.roles
  name        = "bloom-${each.key}-ecs"
  description = "Role the ECS service uses when launching Bloom ${each.key} tasks."
  # https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-iam-roles.html#create_task_iam_policy_and_role
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

resource "aws_iam_role" "bloom_container" {
  for_each    = local.roles
  name        = "bloom-${each.key}-container"
  description = "Role the Bloom ${each.key} container runs as."
  # https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-iam-roles.html#create_task_iam_policy_and_role
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

resource "aws_iam_role_policy" "bloom_ecs" {
  for_each = local.roles
  name     = "bloom-${each.key}-ecs"
  role     = aws_iam_role.bloom_ecs[each.key].id
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
          Resource = "${aws_cloudwatch_log_group.task_logs["bloom-${each.key}"].arn}:log-stream:*"
        },
      ],
      each.value.task_execution_policy_extra_statements
    )
  })
}

resource "aws_iam_role_policy" "bloom_container" {
  for_each = local.roles
  name     = "bloom-${each.key}-container"
  role     = aws_iam_role.bloom_container[each.key].id
  policy   = each.value.container_policy
}

