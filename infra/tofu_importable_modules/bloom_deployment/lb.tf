moved {
  from = aws_lb.bloom
  to   = module.alb.aws_lb.bloom
}

moved {
  from = aws_acm_certificate.bloom
  to   = module.alb.aws_acm_certificate.bloom
}

moved {
  from = aws_lb_listener.bloom
  to   = module.alb.aws_lb_listener.bloom
}

moved {
  from = aws_lb_listener_rule.site_partners
  to   = module.alb.aws_lb_listener_rule.site_partners
}

moved {
  from = aws_lb_target_group.site_partners
  to   = module.alb.aws_lb_target_group.site_partners
}

moved {
  from = aws_lb_listener_rule.site_public
  to   = module.alb.aws_lb_listener_rule.site_public
}

moved {
  from = aws_lb_target_group.site_public
  to   = module.alb.aws_lb_target_group.site_public
}
