resource "aws_secretsmanager_secret" "mapbox_api_key" {
  region      = var.aws_region
  name_prefix = "bloom_mapbox_api_key"
  description = "API key for Mapbox. Value must be manually set via the AWS console."
}

resource "aws_secretsmanager_secret" "google_translate_api_key" {
  region      = var.aws_region
  name_prefix = "bloom_google_translate_api_key"
  description = "API key for Google Translate. Value must be manually set via the AWS console."
}

output "api_key_secret_arns" {
  value = {
    mapbox           = aws_secretsmanager_secret.mapbox_api_key.arn
    google_translate = aws_secretsmanager_secret.google_translate_api_key.arn
  }
  description = "ARNs of the API key secrets in Secrets Manager."
}
