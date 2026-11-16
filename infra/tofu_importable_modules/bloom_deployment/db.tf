moved {
  from = aws_db_subnet_group.bloom
  to   = module.rds.aws_db_subnet_group.bloom
}

moved {
  from = aws_db_instance.bloom
  to   = module.rds.aws_db_instance.bloom
}
