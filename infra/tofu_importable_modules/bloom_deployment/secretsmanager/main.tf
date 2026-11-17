resource "aws_secretsmanager_secret" "mapbox_api_key" {
  region      = var.aws_region
  name_prefix = "bloom-mapbox-api-key-"
  description = "API key for Mapbox. Value must be manually set via the AWS console."
}

resource "aws_secretsmanager_secret" "google_translate_api_key" {
  region      = var.aws_region
  name_prefix = "bloom-google-translate-api-key-"
  description = "API key for Google Translate. Value must be manually set via the AWS console."
}

# Create a secret key used by the API to sign JWTs.
ephemeral "random_password" "api_jwt_signing_key" {
  length  = 256
  special = false # alphanumeric only, so the value is safe in env vars or configs
}

resource "aws_secretsmanager_secret_version" "api_jwt_signing_key" {
  region    = var.aws_region
  secret_id = aws_secretsmanager_secret.api_jwt_signing_key.id

  secret_string_wo         = ephemeral.random_password.api_jwt_signing_key.result
  secret_string_wo_version = 1 # bump to rotate key
}

resource "aws_secretsmanager_secret" "api_jwt_signing_key" {
  region                  = var.aws_region
  description             = "Key used by the Bloom API to sign JWTs"
  name_prefix             = "bloom-api-jwt-signing-key" # avoids 'you can't create this secret because a secret with this name is already scheduled for deletion' issue when re-deploying an account.
  recovery_window_in_days = 7                           # minimum
}
