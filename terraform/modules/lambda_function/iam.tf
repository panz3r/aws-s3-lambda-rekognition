data "aws_iam_policy_document" "lambda_iam_policy" {
  statement {
    sid = ""

    effect = "Allow"

    actions = [
      "sts:AssumeRole",
    ]

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "lambda" {
  name = "${var.function_name}-lambda-role"

  assume_role_policy = "${data.aws_iam_policy_document.lambda_iam_policy.json}"
}

resource "aws_iam_role_policy" "lambda_policy" {
  count = "${length(var.policies) == 0 ? 0 : 1}"
  name  = "${var.function_name}-lambda-policy"
  role  = "${aws_iam_role.lambda.id}"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": ${jsonencode(var.policies)}
}
EOF
}
