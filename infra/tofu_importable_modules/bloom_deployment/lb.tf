# Create an application load balancer that the partners and public sites can be accessed through.
resource "aws_lb" "bloom" {
  region                     = var.aws_region
  name                       = "bloom"
  enable_deletion_protection = local.is_prod

  load_balancer_type = "application"
  internal           = false
  subnets            = [for s in aws_subnet.public : s.id]

  idle_timeout               = 60 # seconds
  security_groups            = [aws_security_group.lb.id]
  enable_zonal_shift         = true
  desync_mitigation_mode     = "strictest"
  drop_invalid_header_fields = true
}
output "lb_dns_name" {
  value       = aws_lb.bloom.dns_name
  description = "DNS name of the load balancer."
}
data "aws_acm_certificate" "bloom" {
  domain      = var.domain_name
  most_recent = true

  lifecycle {
    postcondition {
      condition     = self.status == "ISSUED"
      error_message = "The certificate must be ISSUED before bloom can deploy its load balancer."
    }
  }
}
resource "aws_lb_listener" "bloom" {
  region            = var.aws_region
  load_balancer_arn = aws_lb.bloom.arn
  certificate_arn   = var.aws_certificate_arn

  port     = 443
  protocol = "HTTPS"

  default_action {
    type = "fixed-response"
    fixed_response {
      content_type = "text/plain"
      message_body = "Error: routing misconfiguration"
      status_code  = 501
    }
  }
}

# Routing for partners site
resource "aws_lb_listener_rule" "site_partners" {
  region       = var.aws_region
  listener_arn = aws_lb_listener.bloom.arn
  condition {
    host_header {
      values = ["partners.${var.domain_name}"]
    }
  }
  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.site_partners.arn
  }
  tags = {
    Name = "bloom-site-partners"
  }

  lifecycle {
    replace_triggered_by = [aws_lb_target_group.site_partners]
  }
}
resource "aws_lb_target_group" "site_partners" {
  region = var.aws_region
  vpc_id = aws_vpc.bloom.id
  name   = "bloom-site-partners"

  target_type      = "ip"
  ip_address_type  = "ipv4"
  port             = 3001
  protocol         = "HTTP"
  protocol_version = "HTTP1"

  load_balancing_algorithm_type = "round_robin"
  stickiness {
    enabled = true
    type    = "app_cookie"
    # https://github.com/bloom-housing/bloom/blob/main/docs/Authentication.md
    cookie_name = "access-token"
  }

  deregistration_delay = 5 # seconds
  health_check {
    enabled             = true
    healthy_threshold   = 2  # this is the minimum
    unhealthy_threshold = 2  # this is the minimum
    interval            = 10 # seconds, this is the minimum
    timeout             = 5  # seconds
    protocol            = "HTTP"
    # TODO: use healthcheck endpoint https://github.com/bloom-housing/bloom/issues/5583
    path    = "/"
    matcher = "200"
  }
  target_group_health {
    dns_failover {
      minimum_healthy_targets_count = 1
    }
    unhealthy_state_routing {
      minimum_healthy_targets_count = 1
    }
  }
}

# Routing for public site
resource "aws_lb_listener_rule" "site_public" {
  region       = var.aws_region
  listener_arn = aws_lb_listener.bloom.arn
  condition {
    host_header {
      values = [var.domain_name]
    }
  }
  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.site_public.arn
  }
  tags = {
    Name = "bloom-site-public"
  }

  lifecycle {
    replace_triggered_by = [aws_lb_target_group.site_public]
  }
}
resource "aws_lb_target_group" "site_public" {
  region = var.aws_region
  vpc_id = aws_vpc.bloom.id
  name   = "bloom-site-public"

  target_type      = "ip"
  ip_address_type  = "ipv4"
  port             = 3000
  protocol         = "HTTP"
  protocol_version = "HTTP1"

  load_balancing_algorithm_type = "round_robin"
  stickiness {
    enabled = true
    type    = "app_cookie"
    # https://github.com/bloom-housing/bloom/blob/main/docs/Authentication.md
    cookie_name = "access-token"
  }

  deregistration_delay = 5 # seconds
  health_check {
    enabled             = true
    healthy_threshold   = 2  # this is the minimum
    unhealthy_threshold = 2  # this is the minimum
    interval            = 10 # seconds, this is the minimum
    timeout             = 5  # seconds
    protocol            = "HTTP"
    # TODO: use healthcheck endpoint https://github.com/bloom-housing/bloom/issues/5583
    path    = "/"
    matcher = "200"
  }
  target_group_health {
    dns_failover {
      minimum_healthy_targets_count = 1
    }
    unhealthy_state_routing {
      minimum_healthy_targets_count = 1
    }
  }
}
