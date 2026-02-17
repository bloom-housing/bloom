resource "aws_sesv2_email_identity" "domains" {
  for_each       = toset(var.ses_domains)
  region         = var.aws_region
  email_identity = each.value
}
output "ses_details" {
  value = [
    for d in toset(var.ses_domains) : {
      domain                      = d
      verification_status         = aws_sesv2_email_identity.domains[d].verification_status
      verified_for_sending_status = aws_sesv2_email_identity.domains[d].verified_for_sending_status
      validation_dns_records = [for t in aws_sesv2_email_identity.domains[d].dkim_signing_attributes[0].tokens : {
        record_type  = "CNAME"
        record_name  = "${t}._domainkey.${d}"
        record_value = "${t}.dkim.amazonses.com"
      }]

    }
  ]
  description = "Details for the SES email domains configured."
}
