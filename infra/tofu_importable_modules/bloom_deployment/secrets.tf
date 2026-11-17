moved {
  from = aws_secretsmanager_secret.mapbox_api_key
  to   = module.secretsmanager.aws_secretsmanager_secret.mapbox_api_key
}

moved {
  from = aws_secretsmanager_secret.google_translate_api_key
  to   = module.secretsmanager.aws_secretsmanager_secret.google_translate_api_key
}
