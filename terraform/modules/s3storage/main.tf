#
# AWS S3
#

# We need the AWS provider in order to create the S3 bucket
provider "aws" {
  region = "${var.aws_region}"
}

resource "aws_s3_bucket" "aws_s3_bucket" {
  bucket = "${var.s3_bucket_name}"

  tags = {
    terraform = "true"
    project   = "${var.s3_tags_name}"
    env       = "${var.s3_tags_environment}"
    target    = "storage"
  }

  acl = "private"

  cors_rule {
    allowed_origins = [
      "*",
    ]
    allowed_headers = ["*"]
    allowed_methods = [
      "GET",
      "HEAD",
      "PUT",
    ]
    expose_headers = [
      "x-amz-meta-processed",
      "x-amz-meta-labels",
    ]
    max_age_seconds = 3000
  }
}

output "bucket_name" {
  value = "${var.s3_bucket_name}"
}
output "arn" {
  value = "${aws_s3_bucket.aws_s3_bucket.arn}"
}
