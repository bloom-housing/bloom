# Create an ECS cluster and services for each Bloom binary.
resource "aws_iam_service_linked_role" "ecs" {
  aws_service_name = "ecs.amazonaws.com"
}
resource "aws_ecs_cluster" "bloom" {
  region     = var.aws_region
  name       = "bloom"
  depends_on = [aws_iam_service_linked_role.ecs]
  setting {
    name  = "containerInsights"
    value = "enhanced"
  }
}

# Set up service discovery for the sites to talk to the api.
resource "aws_service_discovery_http_namespace" "bloom" {
  region      = var.aws_region
  name        = "bloom"
  description = "Service namespace the bloom services use."
}

# Create logs groups.
resource "aws_cloudwatch_log_group" "task_logs" {
  for_each = toset([
    "bloom-api",
    "bloom-site-partners",
    "bloom-site-public"
  ])
  region            = var.aws_region
  name              = each.value
  log_group_class   = "STANDARD"
  retention_in_days = local.ecs_logs_retention_days
}

# Create a secret key used by the API to sign JWTs.
resource "aws_secretsmanager_secret" "api_jwt_signing_key" {
  region                  = var.aws_region
  description             = "Key used by the Bloom API to sign JWTs"
  name_prefix             = "bloom-api-jwt-signing-key" # avoids 'you can't create this secret because a secret with this name is already scheduled for deletion' issue when re-deploying an account.
  recovery_window_in_days = 7                           # minimum

  # TODO: use an ephemeral resource instead of local-exec:
  # https://github.com/bloom-housing/bloom/issues/5637.
  #
  # The provisioner block runs after the resource has been created, and never again.
  provisioner "local-exec" {
    interpreter = ["/usr/bin/env", "bash", "-c"]
    # We need to be very careful that any errors result in a non-zero exit code. Otherwise tofu will
    # think this block succeeded and not error.
    command = <<-EOT
    if ! type -P aws &>/dev/null; then
      echo 'ERROR: aws required'
      exit 1
    fi
    if ! type -P openssl &>/dev/null; then
      echo 'ERROR: openssl required'
      exit 1
    fi
    if ! type -P tr &>/dev/null; then
      echo 'ERROR: tr required'
      exit 1
    fi

    if ! s=$(openssl rand -base64 256 | tr -d '\n'); then
        echo 'ERROR: failed to generate random value'
        exit 1
    fi

    if ! aws secretsmanager put-secret-value \
         --profile ${var.aws_profile} \
         --region ${var.aws_region} \
         --secret-id ${self.id} \
         --secret-string "$s"
    then
        echo 'ERROR: failed to put secret value'
        exit 1
    fi
    EOT
  }
}

locals {
  roles = {
    "api" = {
      task_execution_policy_extra_statements = [
        {
          Action   = "secretsmanager:GetSecretValue"
          Effect   = "Allow"
          Resource = aws_db_instance.bloom.master_user_secret[0].secret_arn
        },
        {
          Action   = "secretsmanager:GetSecretValue"
          Effect   = "Allow"
          Resource = aws_secretsmanager_secret.api_jwt_signing_key.arn
        }
      ]
    }
    "site-partners" = {
      task_execution_policy_extra_statements = []
    }
    "site-public" = {
      task_execution_policy_extra_statements = []
    }
  }
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
resource "aws_iam_role_policy" "bloom_container" {
  for_each = local.roles
  name     = "bloom-${each.key}-container"
  role     = aws_iam_role.bloom_container[each.key].id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action   = "*"
      Effect   = "Deny"
      Resource = "*"
    }]
  })
}
