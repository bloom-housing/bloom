moved {
  from = aws_s3_bucket.private
  to   = module.s3.aws_s3_bucket.private
}

moved {
  from = aws_s3_bucket_lifecycle_configuration.private
  to   = module.s3.aws_s3_bucket_lifecycle_configuration.private
}

moved {
  from = aws_s3_bucket_cors_configuration.private
  to   = module.s3.aws_s3_bucket_cors_configuration.private
}

moved {
  from = aws_s3_bucket_policy.private
  to   = module.s3.aws_s3_bucket_policy.private
}

moved {
  from = aws_iam_policy_document.private_bucket
  to   = module.s3.aws_iam_policy_document.private_bucket
}

moved {
  from = aws_s3_bucket.public
  to   = module.s3.aws_s3_bucket.public
}

moved {
  from = aws_s3_bucket_cors_configuration.public
  to   = module.s3.aws_s3_bucket_cors_configuration.public
}

moved {
  from = aws_s3_bucket_public_access_block.public
  to   = module.s3.aws_s3_bucket_public_access_block.public
}

moved {
  from = aws_s3_bucket_policy.public
  to   = module.s3.aws_s3_bucket_policy.public
}

moved {
  from = aws_iam_policy_document.public_bucket
  to   = module.s3.aws_iam_policy_document.public_bucket
}
