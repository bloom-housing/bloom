data "aws_iam_policy_document" "messaging" {
  statement {
    # Allow managing the Pinpoint SMS Voice V2 phone number used for SMS functionality.
    actions = [
      "sms-voice:DescribePhoneNumbers"
    ]
    resources = ["*"]
  }

  statement {
    # Allow managing the Pinpoint SMS Voice V2 phone number used for SMS functionality.
    actions = [
      "sms-voice:ListTagsForResource",
      "sms-voice:ReleasePhoneNumber",
      "sms-voice:RequestPhoneNumber",
      "sms-voice:TagResource",
      "sms-voice:UntagResource",
      "sms-voice:UpdatePhoneNumber",
    ]
    resources = ["arn:aws:sms-voice:${local.region_account}:phone-number/*"]
  }

  statement {
    # Allow creating SES identities.
    actions = [
      "ses:CreateEmailIdentity",
      "ses:DeleteEmailIdentity",
      "ses:GetEmailIdentity",
      "ses:ListTagsForResource",
    ]
    resources = ["arn:aws:ses:${local.region_account}:identity/*"]
  }
}