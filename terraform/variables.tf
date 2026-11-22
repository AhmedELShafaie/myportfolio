variable "aws_region" {
  description = "AWS deployment region"
  type        = string
  default     = "us-east-1"
}

variable "bucket_name" {
  description = "Name of the S3 bucket hosting portfolio"
  type        = string
  default     = "ahmed-fathy-devops-portfolio-prod"
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "production"
}
