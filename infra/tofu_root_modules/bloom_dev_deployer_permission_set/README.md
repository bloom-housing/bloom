# `bloom-dev-deployer` IAM Identity Center Permission Set

This root module configures the `bloom-dev-deployer` IAM Identity Center Permission Set in the Exygy
AWS management account. The permission set is assigned on the `bloom-dev` AWS account to the
`bloom-dev-deployers` IAM Identity Center Group.

The state file for this module is stored in the manually-created `bloom-dev-deployer-tofu-state`
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
