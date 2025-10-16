# bloom-dev-deployer IAM Identity Center Permission Set

This root module configures the bloom-dev-deployer IAM Identity Center Permission Set in the Exygy
AWS management account. The permission set is assigned on the bloom-dev account to the
bloom-dev-deployers group.

The bloom-dev-deployers group is assigned the bloom-permission-set-editor permission set on the
Exygy AWS management account. The bloom-permission-set-editor is a manually created permission set
with the following inline policy:

```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "StateBucket",
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::bloom-dev-deployer-tofu-state"
      ]
    },
    {
      "Sid": "StateFiles",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": [
        "arn:aws:s3:::bloom-dev-deployer-tofu-state/state",
        "arn:aws:s3:::bloom-dev-deployer-tofu-state/state.tflock"
      ]
    },
    {
      "Sid": "PermissionSet",
      "Effect": "Allow",
      "Action": [
        "sso:ListPermissionSetProvisioningStatus",
        "sso:DescribePermissionSet",
        "sso:DescribePermissionSetProvisioningStatus",
        "sso:GetInlinePolicyForPermissionSet",
        "sso:GetPermissionsBoundaryForPermissionSet",
        "sso:GetPermissionSet",
        "sso:PutInlinePolicyToPermissionSet",
        "sso:UpdatePermissionSet",
        "sso:DescribeInstance",
        "sso:CreatePermissionSet",
        "sso:ListTagsForResource",
        "sso:ProvisionPermissionSet"
      ],
      "Resource": [
        "arn:aws:sso:::permissionSet/ssoins-72233fa322bcade3/ps-06b1fe8280547b14",
        "arn:aws:sso:::instance/ssoins-72233fa322bcade3"
      ]
    }
  ]
}
```

The state file for this module is stored in the manually-created bloom-dev-deployer-tofu-state
bucket in the Exygy AWS management account.

To run this terraform module, your `~/.aws/config` file needs to contain:

```
[profile bloom-permission-set-editor]
sso_session = sso
sso_account_id = 098472360576
sso_role_name = bloom-permission-set-editor
region = us-east-1

[sso-session sso]
sso_start_url = https://d-9067ac8222.awsapps.com/start
sso_region = us-east-1
sso_registration_scopes = sso:account:access
```
