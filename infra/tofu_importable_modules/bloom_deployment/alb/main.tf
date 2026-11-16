# Create an application load balancer that the partners and public sites can be accessed through.
resource "aws_lb" "bloom" {
  depends_on                 = [data.aws_acm_certificate.bloom]
  region                     = var.aws_region
  name                       = "bloom"
  enable_deletion_protection = var.is_prod

  load_balancer_type = "application"
  internal           = false
  subnets            = var.aws_public_subnet_ids

  idle_timeout               = 60 # seconds
  security_groups            = var.aws_security_group_ids
  enable_zonal_shift         = true
  desync_mitigation_mode     = "strictest"
  drop_invalid_header_fields = true
  enable_xff_client_port     = true
  preserve_host_header       = true
  xff_header_processing_mode = "append"
}

data "aws_acm_certificate" "bloom" {
  domain      = var.domain_name
  most_recent = true
  # By default the filter is ISSUED. Allow for certs with any status to be returned.
  statuses = [
    "PENDING_VALIDATION",
    "ISSUED",
    "INACTIVE",
    "EXPIRED",
    "VALIDATION_TIMED_OUT",
    "REVOKED",
    "FAILED"
  ]

  lifecycle {
    postcondition {
      condition     = self.status == "ISSUED"
      error_message = "The certificate must be ISSUED before bloom can deploy its load balancer."
    }
  }
}
