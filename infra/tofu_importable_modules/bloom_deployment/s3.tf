resource "aws_s3_bucket" "private" {
  region        = var.aws_region
  bucket_prefix = "bloom-private-"
  force_destroy = var.env_type == "dev"

}
resource "aws_s3_bucket_lifecycle_configuration" "private" {
  region = var.aws_region
  bucket = aws_s3_bucket.private.id
  rule {
    id     = "delete-after-2-days"
    status = "Enabled"
    expiration {
      days = 2
    }
  }
}
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
      identifiers = [aws_iam_role.bloom_ecs["api"].arn]
    }
  }
}

resource "aws_s3_bucket" "public" {
  region        = var.aws_region
  bucket_prefix = "bloom-public-"
  force_destroy = var.env_type == "dev"

}
resource "aws_s3_bucket_cors_configuration" "public" {
  region = var.aws_region
  bucket = aws_s3_bucket.public.id
  cors_rule {
    allowed_methods = ["PUT"]
    allowed_origins = [
      "https://partners.${var.domain_name}",
    ]
  }
}
resource "aws_s3_bucket_public_access_block" "public" {
  region = var.aws_region
  bucket = aws_s3_bucket.public.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
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
      "${aws_s3_bucket.public.arn}",
      "${aws_s3_bucket.public.arn}/*",
    ]
    effect  = "Allow"
    actions = ["s3:PutObject"]
    principals {
      type        = "AWS"
      identifiers = [aws_iam_role.bloom_container["api"].arn]
    }
  }
}
