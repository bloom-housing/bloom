# Create a secret for the API key used to authenticate requests to the data explorer backend.
# This is generated using the same strategy as the JWT signing key in bloom_deployment.
resource "aws_secretsmanager_secret" "api_key" {
  region                  = var.aws_region
  description             = "API key used to authenticate requests to the data explorer backend"
  name_prefix             = "data-explorer-api-key"
  recovery_window_in_days = 7 # minimum

  # The provisioner block runs after the resource has been created, and never again.
  # Uses the same pattern as bloom_deployment for generating the JWT signing key.
  provisioner "local-exec" {
    interpreter = ["/usr/bin/env", "bash", "-c"]
    command     = <<-EOT
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

    if ! s=$(openssl rand -base64 64 | tr -d '\n'); then
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