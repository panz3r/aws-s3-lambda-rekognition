resource "aws_lambda_function" "lambda" {
  function_name = "${var.function_name}"
  description   = "${var.description}"

  filename = "${var.create_empty_function ? "${path.module}/placeholder.zip" : var.filename}"
  runtime  = "${var.runtime}"
  handler  = "${var.handler}"

  role = "${aws_iam_role.lambda.arn}"

  timeout                        = "${var.timeout}"
  memory_size                    = "${var.memory_size}"
  reserved_concurrent_executions = "${var.reserved_concurrent_executions}"

  publish = "${var.publish}"

  tags = "${var.tags}"

  lifecycle {
    ignore_changes = [
      "filename",
    ]
  }
}
