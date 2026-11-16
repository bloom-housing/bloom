output "db_dns_name" {
  value       = aws_db_instance.bloom.address
  description = "DNS name of the database."
}

output "aws_db_instance_id" {
  value       = aws_db_instance.bloom.id
  description = "ID of the AWS RDS instance"
}

output "master_username" {
  value = aws_db_instance.bloom.username
}

output "master_user_secret" {
  value = aws_db_instance.bloom.master_user_secret
}

output "aws_db_address" {
  value = aws_db_instance.bloom.address
}
