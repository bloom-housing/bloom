locals {
  default_init_sql_path   = "${path.module}/sql/init_postgres.sql"
  default_indexes_sql_path = "${path.module}/sql/indexes.sql"

  init_sql_path    = length(trimspace(var.init_sql_source_path)) > 0 ? var.init_sql_source_path : local.default_init_sql_path
  indexes_sql_path = length(trimspace(var.indexes_sql_source_path)) > 0 ? var.indexes_sql_source_path : local.default_indexes_sql_path

  init_sql_sha    = sha256(file(local.init_sql_path))
  indexes_sql_sha = sha256(file(local.indexes_sql_path))
  seed_sql_sha    = var.apply_seed ? sha256(file(var.seed_sql_source_path)) : ""

  seed_enabled = var.apply_seed && length(trimspace(var.seed_sql_source_path)) > 0

  sql_bucket_name = "${var.bloom_deployment}-data-explorer-sql-${var.aws_account_number}"
  init_key        = "bootstrap/init_postgres.sql"
  indexes_key     = "bootstrap/indexes.sql"
  seed_key        = "seed/data_to_import.sql"

  db_name = "housing_reports"
}

# Create a database subnet group using the Bloom private subnets
resource "aws_db_subnet_group" "data_explorer" {
  region     = var.aws_region
  name       = "data-explorer"
  subnet_ids = var.private_subnet_ids
}

# Security group for the data explorer database
resource "aws_security_group" "data_explorer_db" {
  region      = var.aws_region
  vpc_id      = var.vpc_id
  name        = "data-explorer-db"
  description = "Rules for data explorer database."
}

# Allow data explorer tasks to access the database
resource "aws_vpc_security_group_ingress_rule" "data_explorer_db" {
  region                       = var.aws_region
  security_group_id            = aws_security_group.data_explorer_db.id
  referenced_security_group_id = aws_security_group.data_explorer.id
  ip_protocol                  = "tcp"
  from_port                    = 5432
  to_port                      = 5432
  tags = {
    Name = "data-explorer-allow"
  }
}

# Create the RDS PostgreSQL database
resource "aws_db_instance" "data_explorer" {
  identifier                      = "data-explorer"
  deletion_protection             = local.is_prod
  engine                          = "postgres"
  engine_version                  = "17"
  instance_class                  = local.database_config.instance_class
  multi_az                        = var.high_availability
  enabled_cloudwatch_logs_exports = ["postgresql", "upgrade", "iam-db-auth-error"]
  username                        = "master"
  manage_master_user_password     = true
  db_name                         = local.db_name

  # Monitoring
  performance_insights_enabled          = true
  performance_insights_retention_period = 7 # minimum
  database_insights_mode                = "standard"

  # Networking
  vpc_security_group_ids              = [aws_security_group.data_explorer_db.id]
  iam_database_authentication_enabled = true
  db_subnet_group_name                = aws_db_subnet_group.data_explorer.id

  # Updates
  apply_immediately           = true
  engine_lifecycle_support    = "open-source-rds-extended-support"
  allow_major_version_upgrade = false
  auto_minor_version_upgrade  = true

  # Storage
  storage_encrypted         = true
  storage_type              = "gp2"
  allocated_storage         = local.database_config.starting_storage_gb
  max_allocated_storage     = local.database_config.max_storage_gb
  backup_retention_period   = local.database_config.backup_retention_days
  final_snapshot_identifier = "data-explorer-db-finalsnapshot"
  skip_final_snapshot       = !local.is_prod
}

resource "aws_iam_role" "data_explorer_db_bootstrap_task" {
  count       = var.bootstrap_db ? 1 : 0
  name        = "data-explorer-db-bootstrap-task"
  description = "Task role for one-off DB bootstrap task (S3 read for SQL assets)."
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = { Service = "ecs-tasks.amazonaws.com" }
      Condition = {
        ArnLike = { "aws:SourceArn" = "arn:aws:ecs:${var.aws_region}:${var.aws_account_number}:*" }
        StringEquals = { "aws:SourceAccount" = var.aws_account_number }
      }
    }]
  })
}


resource "aws_s3_bucket" "data_explorer_sql" {
  count  = var.bootstrap_db ? 1 : 0
  region = var.aws_region

  bucket        = local.sql_bucket_name
  force_destroy = true
}

resource "aws_s3_bucket_public_access_block" "data_explorer_sql" {
  count  = var.bootstrap_db ? 1 : 0
  region = var.aws_region

  bucket                  = aws_s3_bucket.data_explorer_sql[0].id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_server_side_encryption_configuration" "data_explorer_sql" {
  count  = var.bootstrap_db ? 1 : 0
  region = var.aws_region

  bucket = aws_s3_bucket.data_explorer_sql[0].id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_object" "data_explorer_init_sql" {
  count  = var.bootstrap_db ? 1 : 0
  region = var.aws_region

  bucket                 = aws_s3_bucket.data_explorer_sql[0].bucket
  key                    = local.init_key
  source                 = local.init_sql_path
  etag                   = filemd5(local.init_sql_path)
  server_side_encryption = "AES256"
}

resource "aws_s3_object" "data_explorer_indexes_sql" {
  count  = var.bootstrap_db ? 1 : 0
  region = var.aws_region

  bucket                 = aws_s3_bucket.data_explorer_sql[0].bucket
  key                    = local.indexes_key
  source                 = local.indexes_sql_path
  etag                   = filemd5(local.indexes_sql_path)
  server_side_encryption = "AES256"
}

resource "aws_s3_object" "data_explorer_seed_sql" {
  count  = var.bootstrap_db && local.seed_enabled ? 1 : 0
  region = var.aws_region

  bucket                 = aws_s3_bucket.data_explorer_sql[0].bucket
  key                    = local.seed_key
  source                 = var.seed_sql_source_path
  etag                   = filemd5(var.seed_sql_source_path)
  server_side_encryption = "AES256"
}

resource "aws_iam_role_policy" "data_explorer_db_bootstrap_s3_read" {
  count = var.bootstrap_db ? 1 : 0
  name  = "data-explorer-db-bootstrap-s3-read"
  role  = aws_iam_role.data_explorer_db_bootstrap_task[0].id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:GetObjectVersion"
        ]
        Resource = concat(
          [
            "arn:aws:s3:::${aws_s3_bucket.data_explorer_sql[0].bucket}/${local.init_key}",
            "arn:aws:s3:::${aws_s3_bucket.data_explorer_sql[0].bucket}/${local.indexes_key}"
          ],
          local.seed_enabled ? ["arn:aws:s3:::${aws_s3_bucket.data_explorer_sql[0].bucket}/${local.seed_key}"] : []
        )
      },
      {
        Effect   = "Allow"
        Action   = ["s3:ListBucket"]
        Resource = "arn:aws:s3:::${aws_s3_bucket.data_explorer_sql[0].bucket}"
        Condition = {
          StringLike = {
            "s3:prefix" = concat(
              [local.init_key, local.indexes_key],
              local.seed_enabled ? [local.seed_key] : []
            )
          }
        }
      }
    ]
  })
}

resource "aws_ecs_task_definition" "data_explorer_db_bootstrap" {
  count                    = var.bootstrap_db ? 1 : 0
  region                   = var.aws_region
  family                   = "data-explorer-db-bootstrap"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]

  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "X86_64"
  }

  execution_role_arn = aws_iam_role.data_explorer_ecs.arn

  # IMPORTANT: use the bootstrap task role (not the deny-all container role)
  task_role_arn = aws_iam_role.data_explorer_db_bootstrap_task[0].arn

  cpu    = 256
  memory = 512

  container_definitions = jsonencode([
    {
      name  = "db-bootstrap"
      image = "chusri/postgres-client-awscli:alpine-3.21-pg17"
      environment = [
        { name = "SQL_BUCKET", value = aws_s3_bucket.data_explorer_sql[0].bucket },
        { name = "INIT_KEY",   value = local.init_key },
        { name = "INDEX_KEY",  value = local.indexes_key },
        { name = "SEED_KEY",   value = local.seed_key },
        { name = "APPLY_SEED", value = var.apply_seed ? "true" : "false" }
      ]

      command = [
        "sh",
        "-euc",
        <<-EOS
          set -eu

          conn="host=${aws_db_instance.data_explorer.address} port=${aws_db_instance.data_explorer.port} user=${aws_db_instance.data_explorer.username} dbname=${local.db_name} sslmode=require"
          export PGPASSWORD="$DB_PASSWORD"

          echo "Applying schema from s3://$${SQL_BUCKET}/$${INIT_KEY}..."
          aws s3 cp "s3://$${SQL_BUCKET}/$${INIT_KEY}" - | psql "$conn" -v ON_ERROR_STOP=1

          if [ "$${APPLY_SEED}" = "true" ]; then
            echo "Seeding from s3://$${SQL_BUCKET}/$${SEED_KEY} (drop non-constraint indexes, truncate, import)..."
            aws s3 cp "s3://$${SQL_BUCKET}/$${SEED_KEY}" - | psql "$conn" -v ON_ERROR_STOP=1
          else
            echo "No seed requested; skipping seed."
          fi

          echo "Applying indexes from s3://$${SQL_BUCKET}/$${INDEX_KEY}..."
          aws s3 cp "s3://$${SQL_BUCKET}/$${INDEX_KEY}" - | psql "$conn" -v ON_ERROR_STOP=1

          echo "DB bootstrap complete."
        EOS
      ]

      secrets = [
        {
          name      = "DB_PASSWORD"
          valueFrom = "${aws_db_instance.data_explorer.master_user_secret[0].secret_arn}:password::"
        }
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-region"        = var.aws_region
          "awslogs-group"         = aws_cloudwatch_log_group.data_explorer.name
          "awslogs-stream-prefix" = "data-explorer-db-bootstrap"
        }
      }
    }
  ])

  depends_on = [
    aws_db_instance.data_explorer,
    aws_s3_object.data_explorer_init_sql,
    aws_s3_object.data_explorer_indexes_sql,
    aws_s3_object.data_explorer_seed_sql,
    aws_iam_role_policy.data_explorer_db_bootstrap_s3_read
  ]
}


resource "null_resource" "data_explorer_db_bootstrap_run" {
  count = var.bootstrap_db ? 1 : 0

  triggers = {
    task_definition_arn = aws_ecs_task_definition.data_explorer_db_bootstrap[0].arn
    db_instance_id      = aws_db_instance.data_explorer.id
    bootstrap_db        = var.bootstrap_db ? "true" : "false"
    apply_seed          = var.apply_seed ? "true" : "false"
    init_sql_sha        = local.init_sql_sha
    indexes_sql_sha     = local.indexes_sql_sha
    seed_sql_sha        = local.seed_sql_sha
  }

  provisioner "local-exec" {
    interpreter = ["/usr/bin/env", "bash", "-c"]
    command = <<-EOT
      set -euo pipefail

      if ! type -P aws &>/dev/null; then
        echo "ERROR: aws cli required to run bootstrap task" >&2
        exit 1
      fi

      echo "Running DB bootstrap task..."
      task_arn="$(
        aws ecs run-task \
          --profile ${var.aws_profile} \
          --region ${var.aws_region} \
          --cluster ${var.ecs_cluster_arn} \
          --launch-type FARGATE \
          --task-definition ${aws_ecs_task_definition.data_explorer_db_bootstrap[0].arn} \
          --network-configuration "awsvpcConfiguration={subnets=[${join(",", var.private_subnet_ids)}],securityGroups=[${aws_security_group.data_explorer.id}],assignPublicIp=DISABLED}" \
          --query 'tasks[0].taskArn' \
          --output text
      )"

      if [ -z "$task_arn" ] || [ "$task_arn" = "None" ]; then
        echo "ERROR: failed to start bootstrap task" >&2
        exit 1
      fi

      echo "Waiting for task to stop: $task_arn"
      aws ecs wait tasks-stopped \
        --profile ${var.aws_profile} \
        --region ${var.aws_region} \
        --cluster ${var.ecs_cluster_arn} \
        --tasks "$task_arn"

      exit_code="$(
        aws ecs describe-tasks \
          --profile ${var.aws_profile} \
          --region ${var.aws_region} \
          --cluster ${var.ecs_cluster_arn} \
          --tasks "$task_arn" \
          --query 'tasks[0].containers[0].exitCode' \
          --output text
      )"

      if [ "$exit_code" != "0" ]; then
        reason="$(
          aws ecs describe-tasks \
            --profile ${var.aws_profile} \
            --region ${var.aws_region} \
            --cluster ${var.ecs_cluster_arn} \
            --tasks "$task_arn" \
            --query 'tasks[0].containers[0].reason' \
            --output text
        )"
        echo "ERROR: DB bootstrap task failed exitCode=$exit_code reason=$reason" >&2
        exit 1
      fi

      echo "DB bootstrap task succeeded."
    EOT
  }
}