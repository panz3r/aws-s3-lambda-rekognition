#
# AWS settings
#

# Authentication for the AWS provider

variable "aws_region" {
  description = "AWS Region. Defaults to 'EU (Ireland)'."
  default     = "eu-west-1"
}

#
# AWS S3 settings
#
# These define the details of the S3 bucket that we will create.

variable "s3_bucket_name" {
  description = "Name to assign to the S3 Bucket."
}

variable "s3_region" {
  description = "S3 Bucket Region. Defaults to 'EU (Ireland)'."
  default     = "eu-west-1"
}

variable "s3_tags_name" {
  description = "Bucket 'name' tag."
}

variable "s3_tags_environment" {
  description = "Bucket 'environment' tag."
}
