resource "aws_pinpointsmsvoicev2_phone_number" "api_sms" {
  count               = var.bloom_api_sms_config != null ? 1 : 0
  region              = var.aws_region
  iso_country_code    = "US"
  message_type        = "TRANSACTIONAL"
  number_type         = var.bloom_api_sms_config.number_type
  number_capabilities = ["SMS"]
}

output "sms_phone_number" {
  value       = one(aws_pinpointsmsvoicev2_phone_number.api_sms[*].phone_number)
  description = "Phone number provisioned for sending SMS (E.164 format). Null if SMS is not configured."
}
