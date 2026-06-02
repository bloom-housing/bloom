resource "aws_prometheus_workspace" "bloom" {
  region = var.aws_region
  alias  = "bloom"
}

resource "aws_iam_role" "bloom_grafana" {
  name        = "bloom-grafana"
  description = "Role the Bloom managed Grafana workspace uses."
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "grafana.amazonaws.com"
      }
    }]
  })
}
resource "aws_iam_role_policy" "bloom_grafana" {
  name = "bloom-grafana"
  role = aws_iam_role.bloom_grafana.id
  # From 'Amazon Managed Service for Prometheus' section in
  # https://docs.aws.amazon.com/grafana/latest/userguide/AMG-manage-permissions.html:
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "aps:ListWorkspaces",
          "aps:DescribeWorkspace",
          "aps:QueryMetrics",
          "aps:GetLabels",
          "aps:GetSeries",
          "aps:GetMetricMetadata",
        ]
        Effect = "Allow"
        Resource = [
          "arn:aws:aps:${var.aws_region}:${var.aws_account_number}:/workspaces", # for the ListWorkspaces permission.
          aws_prometheus_workspace.bloom.arn,
        ]
      },
    ]
  })
}

resource "aws_grafana_workspace" "bloom" {
  region                   = var.aws_region
  name                     = "bloom"
  description              = "Dashboards for the Bloom services."
  account_access_type      = "CURRENT_ACCOUNT"
  authentication_providers = ["AWS_SSO"]
  permission_type          = "SERVICE_MANAGED"
  data_sources             = ["PROMETHEUS"]
  role_arn                 = aws_iam_role.bloom_grafana.arn
}
resource "aws_grafana_role_association" "bloom" {
  workspace_id = aws_grafana_workspace.bloom.id
  role         = "EDITOR"
  group_ids    = var.grafana_editor_group_ids
}
output "grafana_url" {
  value       = "https://${aws_grafana_workspace.bloom.endpoint}"
  description = "URL of the managed grafana workspace."
}

# Create a grafana service account and short-lived service account token to use for the grafana
# provider. We need to use a data source here because we need the token to be recreated before the
# plan phase. Otherwise, the plan phase would fail because the expired token would be used to
# refresh the data for the grafana resources.
locals {
  grafana_token_age_seconds = 3 * 60
}
data "external" "grafana_token" {
  program = [
    "/usr/bin/env",
    "bash",
    "-c",
    <<-EOT
      set -eu
      if ! type -P aws &>/dev/null; then
        echo 'ERROR: aws required' >&2
        exit 1
      fi

      echo 'Checking if grafana service account exists...' >&2
      sa_id="$(
        aws grafana list-workspace-service-accounts \
          ${var.aws_profile != "" ? "--profile ${var.aws_profile}" : ""} \
          --region ${var.aws_region} \
          --workspace-id ${aws_grafana_workspace.bloom.id} \
          --no-paginate \
          --query 'serviceAccounts[0].id' \
          --output text
      )"
      if [ "$sa_id" = 'None' ]; then
        echo 'Service account not found, creating...' >&2
        sa_id="$(
          aws grafana create-workspace-service-account \
            ${var.aws_profile != "" ? "--profile ${var.aws_profile}" : ""} \
            --region ${var.aws_region} \
            --workspace-id ${aws_grafana_workspace.bloom.id} \
            --name terraform \
            --grafana-role ADMIN \
            --query 'id' \
            --output text
        )"
      fi

      echo 'Checking if old service account token exists...' >&2
      token_id="$(
        aws grafana list-workspace-service-account-tokens \
          ${var.aws_profile != "" ? "--profile ${var.aws_profile}" : ""} \
          --region ${var.aws_region} \
          --workspace-id ${aws_grafana_workspace.bloom.id} \
          --service-account-id "$sa_id" \
          --no-paginate \
          --query 'serviceAccountTokens[0].id' \
          --output text
      )"
      if [ "$token_id" != 'None' ]; then
        echo 'Token exists, deleting...' >&2
        aws grafana delete-workspace-service-account-token \
          ${var.aws_profile != "" ? "--profile ${var.aws_profile}" : ""} \
          --region ${var.aws_region} \
          --workspace-id ${aws_grafana_workspace.bloom.id} \
          --service-account-id "$sa_id" \
          --token-id "$token_id" >/dev/null
      fi

      echo 'Creating short-lived service account token...' >&2
      token="$(
        aws grafana create-workspace-service-account-token \
          ${var.aws_profile != "" ? "--profile ${var.aws_profile}" : ""} \
          --region ${var.aws_region} \
          --workspace-id ${aws_grafana_workspace.bloom.id} \
          --service-account-id "$sa_id" \
          --name terraform \
          --seconds-to-live ${local.grafana_token_age_seconds} \
          --query 'serviceAccountToken.key' \
          --output text
      )"
      if [ "$token" = '' ]; then
        echo 'ERROR: got back empty string for token.' >&2
        exit 1
      fi

      echo "{\"key\": \"$token\"}"
    EOT
  ]
}


provider "grafana" {
  url  = "https://${aws_grafana_workspace.bloom.endpoint}"
  auth = data.external.grafana_token.result.key
}
resource "grafana_data_source" "prometheus" {
  # Matches the datasource ID in the dashboard JSON files in infra/grafana/dashboards/. Is just an
  # opaque, auto generated UID.
  uid        = "PBFA97CFB590B2093"
  type       = "prometheus"
  name       = "Prometheus"
  is_default = true
  url        = aws_prometheus_workspace.bloom.prometheus_endpoint
  # The prometheus API returns a 'Warning: Deprecated authentication method' message for this, but
  # these are the jsonData settings that are used when adding an aws managed prometheus data source
  # through the aws managed grafana UI.
  json_data_encoded = jsonencode({
    httpMethod    = "GET"
    provisionedBy = "aws-datasource-provisioner-app"
    sigV4Auth     = true
    sigV4AuthType = "ec2_iam_role"
    sigV4Region   = var.aws_region
  })
}
resource "grafana_dashboard" "bloom" {
  for_each    = fileset(path.module, "dashboards/*.json")
  config_json = file("${path.module}/${each.value}")
}
