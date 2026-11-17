variable "aws_region" {
  type        = string
  description = "Region to deploy AWS resources to"
  validation {
    condition = (
      var.aws_region == "us-east-1" ||
      var.aws_region == "us-east-2" ||
      var.aws_region == "us-west-1" ||
      var.aws_region == "us-west-2"
    )
    error_message = "Must be 'us-east-1', 'us-east-2', 'us-west-1', or 'us-west-2'."
  }
}

variable "ses_identities" {
  type        = list(string)
  description = "SES email identities to create. Can either be individual email addresses or domains. If SES in this Bloom deployment will not be taken out of sandbox mode, identities for both sender and receiver email address must be validated for email to be succefully delivered."
  default     = []
}