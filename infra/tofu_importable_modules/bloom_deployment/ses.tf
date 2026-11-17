moved {
  from = aws_sesv2_email_identity.identities
  to   = module.ses.aws_sesv2_email_identity.identities
}
