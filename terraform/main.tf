# We need the AWS provider in order to create the Lambda function
provider "aws" {
  region = "${var.aws_region}"
}

# Configure S3 module
module "s3" {
  source = "./modules/s3storage"

  # S3 setup
  s3_bucket_name      = "${var.app_name}-${var.app_environment}"
  s3_tags_name        = "${var.app_name}"
  s3_tags_environment = "${var.app_environment}"
}

# Configure Lambda module
module "lambda_s3_trigger" {
  source = "./modules/lambda_function"

  function_name         = "${var.app_name}-${var.app_environment}"
  description           = "Lambda to run Rekognition on newly added files to an S3 bucket."
  runtime               = "nodejs10.x"
  handler               = "index.handler"
  create_empty_function = true

  timeout     = 10
  memory_size = 128


  policies = [
    {
      Sid = "AllowLogCreation"

      Effect = "Allow"

      Action = [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
      ]

      Resource = [
        "*",
      ]
    },
    {
      Sid = "AllowS3BucketAccess"

      Effect = "Allow"

      Action = [
        "s3:GetObject",
        "s3:PutObject",
        "s3:PutObjectAcl",
      ]

      Resource = [
        "arn:aws:s3:::${module.s3.bucket_name}",
        "arn:aws:s3:::${module.s3.bucket_name}/*",
      ]
    },
    {
      Sid = "AllowRekognitionDetectLabels"

      Effect = "Allow"

      Action = [
        "rekognition:DetectLabels",
      ]

      Resource = [
        "*"
      ]
    }
  ]

  bucket_trigger = {
    enabled = true
    bucket  = "${module.s3.bucket_name}"
  }

  permissions = {
    enabled      = true
    statement_id = "AllowExecutionFromS3Bucket"
    action       = "lambda:InvokeFunction"
    principal    = "s3.amazonaws.com"
    source_arn   = "arn:aws:s3:::${module.s3.bucket_name}"
  }

  tags = {
    terraform = "true"
    project   = "${var.app_name}"
    env       = "${var.app_environment}"
    target    = "lambda"
  }
}

// @TODO: Create Cognito Identity Pool - see https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/getting-started-browser.html#getting-started-browser-create-identity-pool
resource "aws_cognito_identity_pool" "main" {
  identity_pool_name = "${replace(var.app_name, "-", " ")} ${var.app_environment}"

  allow_unauthenticated_identities = true

  tags = {
    terraform = "true"
    project   = "${var.app_name}"
    env       = "${var.app_environment}"
    target    = "cognito_identity_pool"
  }
}

// @TODO: Attach Policy to access S3 Bucket to Cognito Identity Pool


resource "aws_iam_role" "unauthenticated" {
  name = "${var.app_name}-${var.app_environment}_cognito_unauthenticated_role"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "cognito-identity.amazonaws.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "cognito-identity.amazonaws.com:aud": "${aws_cognito_identity_pool.main.id}"
        },
        "ForAnyValue:StringLike":{
          "cognito-identity.amazonaws.com:amr": "unauthenticated"
        }
      }
    }
  ]
}
EOF

  tags = {
    terraform = "true"
    project   = "${var.app_name}"
    env       = "${var.app_environment}"
    target    = "iam_role_unauthenticated"
  }
}

resource "aws_iam_role_policy" "unauthenticated" {
  name = "${var.app_name}-${var.app_environment}_cognito_unauthenticated_policy"
  role = "${aws_iam_role.unauthenticated.id}"

  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Action": [
                "s3:HeadObject",
                "s3:PutObject",
                "s3:PutObjectAcl"
            ],
            "Resource": [
                "${module.s3.arn}/*"
            ],
            "Effect": "Allow"
        },
        {
            "Action": [
                "s3:ListBucket"
            ],
            "Resource": [
                "${module.s3.arn}"
            ],
            "Effect": "Allow"
        }
    ]
}
EOF
}

resource "aws_cognito_identity_pool_roles_attachment" "main" {
  identity_pool_id = "${aws_cognito_identity_pool.main.id}"

  roles = {
    "unauthenticated" = "${aws_iam_role.unauthenticated.arn}"
  }
}

output "aws_region" {
  value = "${var.aws_region}"
}

output "s3_bucket_name" {
  value = "${module.s3.bucket_name}"
}

output "cognito_identity_pool_id" {
  value = "${aws_cognito_identity_pool.main.id}"
}
