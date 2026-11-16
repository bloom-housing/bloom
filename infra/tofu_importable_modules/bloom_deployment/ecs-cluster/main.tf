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
  for_each = toset(
    concat([ # TODO feed this list in
      "bloom-dbinit",
      "bloom-api",
      "bloom-site-partners",
      "bloom-site-public"
      ], var.bloom_dbseed_image == "" ? [] : ["bloom-dbseed"]
  ))
  region            = var.aws_region
  name              = each.value
  log_group_class   = "STANDARD"
  retention_in_days = var.ecs_logs_retention_days
}
