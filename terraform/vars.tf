#
# App settings
#

# This is the name of the application that we will create.
variable "app_name" {
  description = "Name of the application that will be created."
}

# Application environment - usually something like 'dev' or 'prod'
# We use this to label items and generate names
variable "app_environment" {
  type        = "string"
  default     = "dev"
  description = "Application environment - usually something like 'dev' or 'prod'. Used to label items and generate names"
}

#
# AWS settings
#

variable "aws_region" {
  description = "AWS Region. Defaults to 'EU (Ireland)'."
  default     = "eu-west-1"
}
