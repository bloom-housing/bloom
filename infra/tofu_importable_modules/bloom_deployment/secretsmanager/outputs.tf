output "api_key_secret_arns" {
  value = {
    api_jwt_signing_key = aws_secretsmanager_secret.api_jwt_signing_key.arn
  }
  description = "ARNs of the API key secrets in Secrets Manager."
}
