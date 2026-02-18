resource "aws_sesv2_email_identity" "identities" {
  for_each       = toset(var.ses_identities)
  region         = var.aws_region
  email_identity = each.value
}
output "ses_details" {
  value = [
    for i in toset(var.ses_identities) : {
      identity                    = i
      verification_status         = aws_sesv2_email_identity.identities[i].verification_status
      verified_for_sending_status = aws_sesv2_email_identity.identities[i].verified_for_sending_status
      verification_instructions   = strcontains(i, "@") ? "Use email verification (click link in email to this address with subject 'Amazon Web Services - Email Address Verification Request in region...')" : "Add the validation_dns_records in your DNS provider settings."
      validation_dns_records = strcontains(i, "@") ? null : [for t in aws_sesv2_email_identity.identities[i].dkim_signing_attributes[0].tokens : {
        record_type  = "CNAME"
        record_name  = "${t}._domainkey.${i}"
        record_value = "${t}.dkim.amazonses.com"
      }]

    }
  ]
  description = "Details for the SES email identities configured."
}
