# Must work on the Python version contained in the awslinux base image.
#
# At current time of writing: 3.9.24
#
# To get the version for a particular image tag:
# `docker container run --rm -it --entrypoint python3 ghcr.io/bloom-housing/bloom/infra:<tag> --version`
#
# Formatted with yapf https://github.com/google/yapf with args:
# `--style='{based_on_style:google,SPLIT_BEFORE_FIRST_ARGUMENT:true,COLUMN_LIMIT=100}'`
import argparse
import dataclasses
import pathlib
import re
import string
import sys


def main():
    us_regions = ["us-east-1", "us-east-2", "us-west-1", "us-west-2"]

    p = argparse.ArgumentParser(
        prog="root_module_initializer.py",
        description="CLI entrypoint for initializing Bloom OpenTofu root modules.",
        allow_abbrev=True)

    p.add_argument(
        "--jurisdiction_name",
        help="Name of the Jurisdiction this Bloom deployment is for.",
        required=True)
    p.add_argument(
        "--iam_identity_center_region",
        help="AWS region the IAM Identity Center instance is in",
        required=True,
        choices=us_regions)
    p.add_argument(
        "--organization_management_account_number",
        help="AWS account number for the organization management account",
        required=True)
    p.add_argument(
        "--iam_identity_center_arn", help="ARN of the IAM Identity Center instance", required=True)
    p.add_argument(
        "--iam_identity_center_access_portal_url",
        help="URL for the IAM Identity Center access portal.",
        required=True)
    p.add_argument(
        "--dev_deployer_group_id",
        help=
        "IAM Identity Center group ID for the bloom-dev-deployers group. Used as the default Grafana editor group.",
        required=True)
    p.add_argument(
        "--prod_deployer_group_id",
        help=
        "IAM Identity Center group ID for the bloom-prod-deployers group. Used as the default Grafana editor group.",
        required=True)
    p.add_argument(
        "--dev_deployer_permission_set_arn",
        help="ARN of the dev deployer IAM Identity center permission set",
        required=True)
    p.add_argument(
        "--prod_deployer_permission_set_arn",
        help="ARN of the prod deployer IAM Identity center permission set",
        required=True)
    p.add_argument(
        "--tofu_state_bucket_region",
        help="AWS region the Tofu state S3 bucket is in.",
        required=True,
        choices=us_regions)
    p.add_argument(
        "--tofu_state_bucket_name",
        help="The name of the S3 bucket used to store Tofu state files.",
        required=True)
    p.add_argument(
        "--github_org",
        help="The name of the GitHub organization that the Bloom fork is created in.",
        required=True)
    p.add_argument(
        "--git_commit_sha", help="The git commit SHA from your fork to deploy.", required=True)
    p.add_argument(
        "--bloom_aws_region",
        help="What AWS region to deploy to.",
        required=True,
        choices=us_regions)
    p.add_argument(
        "--dev_aws_account_number",
        help="The AWS account number that the dev Bloom deployment will be deployed to.",
        required=True)
    p.add_argument(
        "--prod_aws_account_number",
        help="The AWS account number that the prod Bloom deployment will be deployed to.",
        required=True)
    p.add_argument(
        "--dev_domain_name", help="The domain name for the dev Bloom deployment.", required=True)
    p.add_argument(
        "--prod_domain_name", help="The domain name for the prod Bloom deployment.", required=True)

    p.add_argument(
        "--print_to_stdout",
        help="Print the file contents to stdout instead of writing to the filesystem.",
        action="store_true",
        required=False)

    args = p.parse_args()
    validate_inputs(args)

    write_template(
        args.print_to_stdout, pathlib.Path("/bloom/infra/aws_sso_config"), AWS_SSO_TEMPLATE,
        AwsSSOConfigTemplateArgs(
            MANAGEMENT_AWS_ACCOUNT_NUMBER=args.organization_management_account_number,
            IAM_IDENTITY_CENTER_REGION=args.iam_identity_center_region,
            IAM_IDENTITY_CENTER_ACCESS_PORTAL_URL=args.iam_identity_center_access_portal_url,
            DEV_AWS_ACCOUNT_NUMBER=args.dev_aws_account_number,
            PROD_AWS_ACCOUNT_NUMBER=args.prod_aws_account_number,
        ))

    write_template(
        args.print_to_stdout,
        pathlib.Path(
            "/bloom/infra/tofu_root_modules/bloom_dev_deployer_permission_set_policy/main.tf"),
        BLOOM_PERMISSION_SET_TEMPLATE,
        BloomPermissionSetPolicyTemplateArgs(
            DEPLOYMENT_NAME="bloom-dev",
            TOFU_STATE_BUCKET_REGION=args.tofu_state_bucket_region,
            TOFU_STATE_BUCKET_NAME=args.tofu_state_bucket_name,
            IAM_IDENTITY_CENTER_REGION=args.iam_identity_center_region,
            IAM_IDENTITY_CENTER_ARN=args.iam_identity_center_arn,
            DEPLOYER_PERMISSION_SET_ARN=args.dev_deployer_permission_set_arn,
            BLOOM_AWS_REGION=args.bloom_aws_region,
            BLOOM_AWS_ACCOUNT_NUMBER=args.dev_aws_account_number,
        ))
    write_template(
        args.print_to_stdout, pathlib.Path("/bloom/infra/tofu_root_modules/bloom_dev/main.tf"),
        BLOOM_DEPLOYMENT_TEMPLATE,
        BloomDeploymentTemplateArgs(
            JURISDICTION_NAME=args.jurisdiction_name,
            DEPLOYMENT_NAME="bloom-dev",
            TOFU_STATE_BUCKET_REGION=args.tofu_state_bucket_region,
            TOFU_STATE_BUCKET_NAME=args.tofu_state_bucket_name,
            BLOOM_AWS_REGION=args.bloom_aws_region,
            BLOOM_AWS_ACCOUNT_NUMBER=args.dev_aws_account_number,
            DOMAIN_NAME=args.dev_domain_name,
            GITHUB_ORG=args.github_org,
            GIT_COMMIT=args.git_commit_sha,
            BLOOM_ENV_TYPE="dev",
            HIGH_AVAILABILITY="false",
            GRAFANA_EDITOR_GROUP_ID=args.dev_deployer_group_id,
        ))

    write_template(
        args.print_to_stdout,
        pathlib.Path(
            "/bloom/infra/tofu_root_modules/bloom_prod_deployer_permission_set_policy/main.tf"),
        BLOOM_PERMISSION_SET_TEMPLATE,
        BloomPermissionSetPolicyTemplateArgs(
            DEPLOYMENT_NAME="bloom-prod",
            TOFU_STATE_BUCKET_REGION=args.tofu_state_bucket_region,
            TOFU_STATE_BUCKET_NAME=args.tofu_state_bucket_name,
            IAM_IDENTITY_CENTER_REGION=args.iam_identity_center_region,
            IAM_IDENTITY_CENTER_ARN=args.iam_identity_center_arn,
            DEPLOYER_PERMISSION_SET_ARN=args.prod_deployer_permission_set_arn,
            BLOOM_AWS_REGION=args.bloom_aws_region,
            BLOOM_AWS_ACCOUNT_NUMBER=args.prod_aws_account_number,
        ))
    write_template(
        args.print_to_stdout, pathlib.Path("/bloom/infra/tofu_root_modules/bloom_prod/main.tf"),
        BLOOM_DEPLOYMENT_TEMPLATE,
        BloomDeploymentTemplateArgs(
            JURISDICTION_NAME=args.jurisdiction_name,
            DEPLOYMENT_NAME="bloom-prod",
            BLOOM_AWS_REGION=args.bloom_aws_region,
            TOFU_STATE_BUCKET_REGION=args.tofu_state_bucket_region,
            TOFU_STATE_BUCKET_NAME=args.tofu_state_bucket_name,
            BLOOM_AWS_ACCOUNT_NUMBER=args.prod_aws_account_number,
            DOMAIN_NAME=args.prod_domain_name,
            GITHUB_ORG=args.github_org,
            GIT_COMMIT=args.git_commit_sha,
            BLOOM_ENV_TYPE="production",
            HIGH_AVAILABILITY="true",
            GRAFANA_EDITOR_GROUP_ID=args.prod_deployer_group_id,
        ))


def validate_inputs(args):
    """Does some simple validations of CLI inputs and exit with a error if any are invalid."""
    errors = []

    # AWS account numbers: must be exactly 12 digits:
    # https://docs.aws.amazon.com/accounts/latest/reference/manage-acct-identifiers.html
    for arg, value in [
        ("--organization_management_account_number", args.organization_management_account_number),
        ("--dev_aws_account_number", args.dev_aws_account_number),
        ("--prod_aws_account_number", args.prod_aws_account_number),
    ]:
        if not re.fullmatch(r"\d{12}", value):
            errors.append(f"{arg} must be exactly 12 digits, got '{value}'")

    # All account numbers should be different
    if len({args.organization_management_account_number, args.dev_aws_account_number,
            args.prod_aws_account_number}) != 3:
        errors.append(
            f"--organization_management_account_number, --dev_aws_account_number, and --prod_aws_account_number must all be different"
        )

    # IAM Identity Center ARNs
    match = re.match(r"^arn:aws:sso:::instance/ssoins-(.+)$", args.iam_identity_center_arn)
    if match is None:
        errors.append(
            f"--iam_identity_center_arn must be a valid ARN (arn:aws:sso:::instance/ssoins-...), got '{args.iam_identity_center_arn}'"
        )
    else:
        ssoins = match[1]
        for arg, value in [
            ("--dev_deployer_permission_set_arn", args.dev_deployer_permission_set_arn),
            ("--prod_deployer_permission_set_arn", args.prod_deployer_permission_set_arn),
        ]:
            if re.match(f"^arn:aws:sso:::permissionSet/ssoins-{ssoins}/ps-.+$", value) is None:
                errors.append(
                    f"{arg} must be a valid permission set ARN in the IAM Identity Center Instance specificed in --iam_identity_center_arn (ssoins-{ssoins}), got '{value}'"
                )
    if args.dev_deployer_permission_set_arn == args.prod_deployer_permission_set_arn:
        errors.append(
            f"--dev_deployer_permission_set_arn and --prod_deployer_permission_set_arn must be different, both are '{args.dev_deployer_permission_set_arn}'"
        )

    # IAM Identity Center access portal URL
    if not re.fullmatch(r"https://[a-zA-Z0-9._-]+\.awsapps\.com/start/?",
                        args.iam_identity_center_access_portal_url):
        errors.append(
            f"--iam_identity_center_access_portal_url must be a valid AWS access portal URL (https://<id>.awsapps.com/start), got '{args.iam_identity_center_access_portal_url}'"
        )

    # S3 bucket name: 3-63 chars, lowercase alphanumeric, hyphens, dots, must start and end with
    # letter or number:
    # https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucketnamingrules.html
    if not re.fullmatch(r"[a-z0-9][a-z0-9.\-]{1,61}[a-z0-9]", args.tofu_state_bucket_name):
        errors.append(
            f"--tofu_state_bucket_name must be a valid S3 bucket name, got '{args.tofu_state_bucket_name}'"
        )

    # Domain names
    domain_pattern = re.compile(r"^([a-zA-Z0-9_\-\.])+[a-zA-Z]{2,}$")
    for label, value in [
        ("--dev_domain_name", args.dev_domain_name),
        ("--prod_domain_name", args.prod_domain_name),
    ]:
        if not domain_pattern.match(value):
            errors.append(f"{label}: must be a valid domain name, got '{value}'")

    if args.dev_domain_name == args.prod_domain_name:
        errors.append(
            f"--dev_domain_name and --prod_domain_name must be different, both are '{args.dev_domain_name}'"
        )

    # Deployer group IDs
    for arg, value in [
        ("--dev_deployer_group_id", args.dev_deployer_group_id),
        ("--prod_deployer_group_id", args.prod_deployer_group_id),
    ]:
        if not value:
            errors.append(f"{arg} must not be empty")
    if args.dev_deployer_group_id == args.prod_deployer_group_id:
        errors.append(
            f"--dev_deployer_group_id and --prod_deployer_group_id must be different, both are '{args.dev_deployer_group_id}'"
        )

    # GitHub org: not the empty string
    if not args.github_org:
        errors.append(f"--github_org: must not be empty")

    # Git commit SHA: 40-character hex string
    if not re.fullmatch(r"[0-9a-fA-F]{40}", args.git_commit_sha):
        errors.append(
            f"--git_commit_sha: must be a full 40-character hex SHA, got '{args.git_commit_sha}'")

    # Jurisdiction name: non-empty, printable characters
    if not args.jurisdiction_name:
        errors.append("--jurisdiction_name: must not be empty")
    elif not re.fullmatch(r"[a-zA-Z0-9 .'\-]+", args.jurisdiction_name):
        errors.append(
            f"--jurisdiction_name: must contain only alphanumeric characters, spaces, periods, apostrophes, and hyphens, got '{args.jurisdiction_name}'"
        )

    if len(errors) > 0:
        sys.exit("FATAL: Input validation failed:\n  " + "\n  ".join(errors))


def write_template(
        print_to_stdout: bool, path: pathlib.Path, template: string.Template, template_args):
    """template_args is a dataclass"""
    print(f"== Writing {path}")
    try:
        rendered = template.substitute(dataclasses.asdict(template_args)).lstrip()
    except KeyError as e:
        sys.exit(f"FATAL: template references an undefined variable: {e}")
    except ValueError as e:
        match = re.search(r"line (\d+), col (\d+)", str(e))
        if match is None:
            sys.exit(f"FATAL: error rendering template: {e}")

        line = match[1]
        col = match[2]

        err = f"FATAL: error rendering template. Invalid substitution in template line {line}:\n"
        err += template.template.split("\n")[int(line) - 1] + "\n"
        err += " " * (int(col) - 1) + "^\n"
        err += "Hint: for a Tofu string template reference, change to $${"

        sys.exit(err)
    if print_to_stdout:
        print(rendered)
    else:
        path.parent.mkdir(parents=True, exist_ok=True)
        with open(path, "w") as file:
            file.write(rendered)


@dataclasses.dataclass
class AwsSSOConfigTemplateArgs:
    MANAGEMENT_AWS_ACCOUNT_NUMBER: str
    IAM_IDENTITY_CENTER_REGION: str
    IAM_IDENTITY_CENTER_ACCESS_PORTAL_URL: str
    DEV_AWS_ACCOUNT_NUMBER: str
    PROD_AWS_ACCOUNT_NUMBER: str


# Substitute variables from the template args using ${var}. Use $${var} to output Tofu
# string templating like referencing locals.
AWS_SSO_TEMPLATE = string.Template(
    """
[profile bloom-dev-deployer]
sso_session = sso
sso_role_name = bloom-dev-deployer
sso_account_id = ${DEV_AWS_ACCOUNT_NUMBER}

[profile bloom-prod-deployer]
sso_session = sso
sso_role_name = bloom-prod-deployer
sso_account_id = ${PROD_AWS_ACCOUNT_NUMBER}

[profile bloom-dev-iam-admin]
sso_session = sso
sso_role_name = bloom-dev-iam-admin
sso_account_id = ${MANAGEMENT_AWS_ACCOUNT_NUMBER}

[profile bloom-prod-iam-admin]
sso_session = sso
sso_role_name = bloom-prod-iam-admin
sso_account_id = ${MANAGEMENT_AWS_ACCOUNT_NUMBER}

[sso-session sso]
sso_start_url = ${IAM_IDENTITY_CENTER_ACCESS_PORTAL_URL}
sso_region = ${IAM_IDENTITY_CENTER_REGION}
sso_registration_scopes = sso:account:access
""")


@dataclasses.dataclass
class BloomPermissionSetPolicyTemplateArgs:
    DEPLOYMENT_NAME: str
    TOFU_STATE_BUCKET_REGION: str
    TOFU_STATE_BUCKET_NAME: str
    IAM_IDENTITY_CENTER_REGION: str
    IAM_IDENTITY_CENTER_ARN: str
    DEPLOYER_PERMISSION_SET_ARN: str
    BLOOM_AWS_REGION: str
    BLOOM_AWS_ACCOUNT_NUMBER: str


# Substitute variables from the template args using ${var}. Use $${var} to output Tofu
# string templating like referencing locals.
BLOOM_PERMISSION_SET_TEMPLATE = string.Template(
    """
locals {
  bloom_deployment = "${DEPLOYMENT_NAME}"
  sso_profile_id   = "$${local.bloom_deployment}-iam-admin"

  tofu_state_bucket_region = "${TOFU_STATE_BUCKET_REGION}"
  tofu_state_bucket_name   = "${TOFU_STATE_BUCKET_NAME}"
  tofu_state_key_prefix    = "$${local.bloom_deployment}-deployer-permissionset-policy"

  iam_identity_center_region       = "${IAM_IDENTITY_CENTER_REGION}"
  iam_identity_center_instance_arn = "${IAM_IDENTITY_CENTER_ARN}"
  deployer_permission_set_arn      = "${DEPLOYER_PERMISSION_SET_ARN}"

  bloom_deployment_aws_account_number     = "${BLOOM_AWS_ACCOUNT_NUMBER}"
  bloom_deployment_aws_region             = "${BLOOM_AWS_REGION}"
  bloom_deployment_tofu_state_bucket_name = local.tofu_state_bucket_name
  bloom_deployment_tofu_state_file_prefix = local.bloom_deployment
}

terraform {
  backend "s3" {
    profile      = local.sso_profile_id
    region       = local.tofu_state_bucket_region
    bucket       = local.tofu_state_bucket_name
    key          = "$${local.tofu_state_key_prefix}/state"
    use_lockfile = true
  }
}

provider "aws" {
  profile = local.sso_profile_id
  region  = local.iam_identity_center_region
}

module "deployer_permission_set" {
  source = "../../tofu_importable_modules/bloom_deployer_permission_set_policy"

  iam_identity_center_instance_arn = local.iam_identity_center_instance_arn
  permission_set_arn               = local.deployer_permission_set_arn

  bloom_deployment_aws_account_number     = local.bloom_deployment_aws_account_number
  bloom_deployment_aws_region             = local.bloom_deployment_aws_region
  bloom_deployment_tofu_state_bucket_name = local.bloom_deployment_tofu_state_bucket_name
  bloom_deployment_tofu_state_file_prefix = local.bloom_deployment_tofu_state_file_prefix
}
""")


@dataclasses.dataclass
class BloomDeploymentTemplateArgs:
    JURISDICTION_NAME: str
    DEPLOYMENT_NAME: str
    TOFU_STATE_BUCKET_REGION: str
    TOFU_STATE_BUCKET_NAME: str
    BLOOM_AWS_REGION: str
    BLOOM_AWS_ACCOUNT_NUMBER: str
    DOMAIN_NAME: str
    GITHUB_ORG: str
    GIT_COMMIT: str
    BLOOM_ENV_TYPE: str
    HIGH_AVAILABILITY: str
    GRAFANA_EDITOR_GROUP_ID: str


BLOOM_DEPLOYMENT_TEMPLATE = string.Template(
    """
locals {
  bloom_deployment = "${DEPLOYMENT_NAME}"
  sso_profile_id   = "$${local.bloom_deployment}-deployer"

  tofu_state_bucket_region = "${TOFU_STATE_BUCKET_REGION}"
  tofu_state_bucket_name   = "${TOFU_STATE_BUCKET_NAME}"
  tofu_state_key_prefix    = local.bloom_deployment

  bloom_aws_account_number = "${BLOOM_AWS_ACCOUNT_NUMBER}"
  bloom_aws_region         = "${BLOOM_AWS_REGION}"
  domain_name              = "${DOMAIN_NAME}"
}

terraform {
  required_providers {
    aws = {
      version = "6.21.0"
      source  = "hashicorp/aws"
    }
  }
  backend "s3" {
    profile      = local.sso_profile_id
    region       = local.tofu_state_bucket_region
    bucket       = local.tofu_state_bucket_name
    key          = "$${local.tofu_state_key_prefix}/state"
    use_lockfile = true
  }
}

provider "aws" {
  profile = local.sso_profile_id
  region  = local.bloom_aws_region
}

# Create and validate a certificate for bloom_deployment module to deploy successfully. See the
# README.md for more details for how to deploy and validate the certificate before deploying the
# bloom_deployment module.
resource "aws_acm_certificate" "bloom" {
  region            = local.bloom_aws_region
  validation_method = "DNS"
  domain_name       = local.domain_name
  subject_alternative_names = [
    "partners.$${local.domain_name}"
  ]
  lifecycle {
    create_before_destroy = true
  }
}
output "certificate_details" {
  value = {
    certificate_arn    = aws_acm_certificate.bloom.arn
    certificate_status = aws_acm_certificate.bloom.status
    expires_at         = aws_acm_certificate.bloom.not_after
    managed_renewal = {
      eligible = aws_acm_certificate.bloom.renewal_eligibility
      status   = aws_acm_certificate.bloom.renewal_summary
    }
    validation_dns_records = aws_acm_certificate.bloom.domain_validation_options
  }
  description = "DNS records required to be manually added for the LB TLS certificate to be issued."
}

# Deploy bloom into the account.
module "bloom_deployment" {
  source = "../../tofu_importable_modules/bloom_deployment"

  aws_profile        = local.sso_profile_id
  aws_account_number = local.bloom_aws_account_number
  aws_region         = local.bloom_aws_region

  domain_name         = aws_acm_certificate.bloom.domain_name
  aws_certificate_arn = aws_acm_certificate.bloom.arn

  env_type          = "${BLOOM_ENV_TYPE}"
  high_availability = ${HIGH_AVAILABILITY}

  bloom_dbinit_image = "ghcr.io/${GITHUB_ORG}/bloom/dbinit:gitsha-${GIT_COMMIT}"
  bloom_dbseed_image = "ghcr.io/${GITHUB_ORG}/bloom/dbseed:gitsha-${GIT_COMMIT}"

  bloom_api_image           = "ghcr.io/${GITHUB_ORG}/bloom/api:gitsha-${GIT_COMMIT}"
  bloom_site_partners_image = "ghcr.io/${GITHUB_ORG}/bloom/partners:gitsha-${GIT_COMMIT}"
  bloom_site_public_image   = "ghcr.io/${GITHUB_ORG}/bloom/public:gitsha-${GIT_COMMIT}"
  bloom_site_public_env_vars = {
    JURISDICTION_NAME = "${JURISDICTION_NAME}"
    LANGUAGES         = "en,es,zh,vi,tl,ko,hy"
    RTL_LANGUAGES     = "ar,fa"
  }

  grafana_editor_group_ids = ["${GRAFANA_EDITOR_GROUP_ID}"]
}
output "aws_lb_dns_name" {
  value       = module.bloom_deployment.lb_dns_name
  description = "DNS name of the load balancer."
}
output "aws_db_dns_name" {
  value       = module.bloom_deployment.db_dns_name
  description = "DNS name of the database."
}
output "ses_details" {
  value       = module.bloom_deployment.ses_details
  description = "Details for the SES email address identity."
}
""")

if __name__ == "__main__":
    main()
