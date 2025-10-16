# `bloom-dev-deployer` IAM Identity Center Permission Set

This root module configures the `bloom-dev-deployer` IAM Identity Center Permission Set in the Exygy
AWS management account. The permission set is assigned on the `bloom-dev` AWS account to the
`bloom-dev-deployers` IAM Identity Center Group.

The state file for this module is stored in the manually-created `bloom-dev-deployer-tofu-state`
bucket in the Exygy AWS management account.
