resource "aws_sesv2_email_identity" "identities" {
  for_each       = toset(var.ses_identities)
  region         = var.aws_region
  email_identity = each.value
}