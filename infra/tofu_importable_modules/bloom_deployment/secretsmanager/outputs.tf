output "api_key_secret_arns" {
  value = {
    mapbox_api_key              = aws_secretsmanager_secret.mapbox_api_key.arn
    google_translate_api_key    = aws_secretsmanager_secret.google_translate_api_key.arn
    api_jwt_signing_key = aws_secretsmanager_secret.api_jwt_signing_key.arn
  }
  description = "ARNs of the API key secrets in Secrets Manager."
}
