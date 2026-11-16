resource "aws_s3_bucket_policy" "private" {
  region = var.aws_region
  bucket = aws_s3_bucket.private.id
  policy = data.aws_iam_policy_document.private_bucket.json
}

data "aws_iam_policy_document" "private_bucket" {
  statement {
    sid = "API"
    resources = [
      "${aws_s3_bucket.private.arn}",
      "${aws_s3_bucket.private.arn}/*",
    ]
    effect  = "Allow"
    actions = ["s3:GetObject", "s3:PutObject"]
    principals {
      type        = "AWS"
      identifiers = [var.bloom_api_container_iam_role_arn]
    }
  }
}

resource "aws_s3_bucket_policy" "public" {
  region = var.aws_region
  bucket = aws_s3_bucket.public.id
  policy = data.aws_iam_policy_document.public_bucket.json
}

data "aws_iam_policy_document" "public_bucket" {
  statement {
    sid       = "PublicGet"
    resources = ["${aws_s3_bucket.public.arn}/*"]
    effect    = "Allow"
    actions   = ["s3:GetObject"]
    principals {
      type        = "*"
      identifiers = ["*"]
    }
  }

  statement {
    sid = "APIPresignURL"
    resources = [
      aws_s3_bucket.public.arn,
      "${aws_s3_bucket.public.arn}/*",
    ]
    effect  = "Allow"
    actions = ["s3:PutObject"]
    principals {
      type        = "AWS"
      identifiers = [var.bloom_api_container_iam_role_arn]
    }
  }
}
