resource "aws_s3_bucket" "private" {
  region        = var.aws_region
  bucket_prefix = "bloom-private-"
  force_destroy = !var.is_prod // is dev

}

resource "aws_s3_bucket_lifecycle_configuration" "private" {
  region = var.aws_region
  bucket = aws_s3_bucket.private.id
  rule {
    id     = "delete-after-1-day"
    status = "Enabled"
    expiration {
      days = 1
    }
  }
}

resource "aws_s3_bucket_cors_configuration" "private" {
  region = var.aws_region
  bucket = aws_s3_bucket.private.id
  cors_rule {
    allowed_methods = ["PUT"]
    allowed_origins = [
      "https://partners.${var.domain_name}",
    ]
    allowed_headers = ["Content-Type", "Content-Disposition"]
  }
}

resource "aws_s3_bucket" "public" {
  region        = var.aws_region
  bucket_prefix = "bloom-public-"
  force_destroy = !var.is_prod // is dev
}

resource "aws_s3_bucket_cors_configuration" "public" {
  region = var.aws_region
  bucket = aws_s3_bucket.public.id
  cors_rule {
    allowed_methods = ["PUT"]
    allowed_origins = [
      "https://partners.${var.domain_name}",
    ]
    allowed_headers = ["Content-Type", "Content-Disposition"]
  }

  cors_rule {
    allowed_headers = ["Content-Type"]
    allowed_methods = ["GET"]
    allowed_origins = ["https://partners.${var.domain_name}", "https://${var.domain_name}"]
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
