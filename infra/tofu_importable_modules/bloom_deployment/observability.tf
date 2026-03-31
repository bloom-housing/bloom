resource "aws_prometheus_workspace" "bloom" {
  region = var.aws_region
  alias  = "bloom"
}

resource "aws_grafana_workspace" "bloom" {
  region                   = var.aws_region
  name                     = "bloom"
  description              = "Dashboards for the Bloom services."
  account_access_type      = "CURRENT_ACCOUNT"
  authentication_providers = ["AWS_SSO"]
  permission_type          = "SERVICE_MANAGED"
  data_sources             = ["PROMETHEUS"]
}

output "grafana_workspace_endpoint" {
  value       = "https://${aws_grafana_workspace.bloom.endpoint}"
  description = "URL for the AWS Managed Grafana workspace."
}

#provider "grafana" {
#  url = grafana_workspace_endpoint
#}
