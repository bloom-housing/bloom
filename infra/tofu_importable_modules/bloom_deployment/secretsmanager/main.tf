# Create a secret key used by the API to sign JWTs.
resource "aws_secretsmanager_secret" "api_jwt_signing_key" {
  region                  = var.aws_region
  description             = "Key used by the Bloom API to sign JWTs"
  name_prefix             = "bloom-api-jwt-signing-key" # avoids 'you can't create this secret because a secret with this name is already scheduled for deletion' issue when re-deploying an account.
  recovery_window_in_days = 7                           # minimum

  # TODO: use an ephemeral resource instead of local-exec:
  # https://github.com/bloom-housing/bloom/issues/5637.
  #
  # The provisioner block runs after the resource has been created, and never again.
  provisioner "local-exec" {
    interpreter = ["/usr/bin/env", "bash", "-c"]
    # We need to be very careful that any errors result in a non-zero exit code. Otherwise tofu will
    # think this block succeeded and not error.
    command = <<-EOT
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

    if ! s=$(openssl rand -base64 256 | tr -d '\n'); then
        echo 'ERROR: failed to generate random value'
        exit 1
    fi

    if ! aws secretsmanager put-secret-value \
         ${var.aws_profile != "" ? "--profile ${var.aws_profile}" : ""} \
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
