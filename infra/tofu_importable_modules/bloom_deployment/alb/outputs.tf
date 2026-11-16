output "lb_dns_name" {
  value       = aws_lb.bloom.dns_name
  description = "DNS name of the load balancer."
}

output "aws_lb_target_group_site_partners_arn" {
  value       = aws_lb_target_group.site_partners.arn
  description = "ARN for the ALB target group of the partners site."
}

output "aws_lb_target_group_site_public_arn" {
  value       = aws_lb_target_group.site_public.arn
  description = "ARN for the ALB target group of the partners site."
}
