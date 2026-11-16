output "lb_dns_name" {
  value       = module.alb.lb_dns_name
  description = "DNS name of the load balancer."
}

output "db_dns_name" {
  value       = module.rds.db_dns_name
  description = "DNS name of the database."
}
