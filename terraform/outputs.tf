output "s3_bucket_id" {
  description = "S3 Bucket Name"
  value       = aws_s3_bucket.portfolio.id
}

output "cloudfront_distribution_id" {
  description = "CloudFront Distribution ID"
  value       = aws_cloudfront_distribution.portfolio.id
}

output "cloudfront_domain_name" {
  description = "CloudFront Domain URL for the portfolio"
  value       = "https://${aws_cloudfront_distribution.portfolio.domain_name}"
}
