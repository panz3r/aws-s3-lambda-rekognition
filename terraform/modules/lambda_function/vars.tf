variable "aws_region" {
  default     = "eu-west-1"
  description = "The region of AWS"
}

variable "tags" {
  type    = "map"
  default = {}
}

variable "function_name" {
  type = "string"
}

variable "description" {
  type    = "string"
  default = ""
}

variable "runtime" {
  type = "string"
}

variable "publish" {
  default = false
}

variable "handler" {
  type = "string"
}

variable "filename" {
  type    = "string"
  default = ""
}

variable "environment" {
  type    = "map"
  default = {}
}

variable "source_mappings" {
  type    = "list"
  default = []
}


variable "policies" {
  type    = "list"
  default = []
}

variable "permissions" {
  type = "map"

  default = {
    enabled = false
  }
}

variable "bucket_trigger" {
  type = "map"

  default = {
    enabled = false
  }
}

variable "memory_size" {
  type    = "string"
  default = "128"
}

variable "timeout" {
  type = "string"
}

variable "create_empty_function" {
  default = false
}

variable "reserved_concurrent_executions" {
  default = "-1"
}
