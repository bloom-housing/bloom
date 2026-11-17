# Note about IAM Policies

The IAM Identity Center permission set inline policy limit is 10,240 non-whitespace characters,
and each customer managed policy is limited to 6,144. To stay under both, the deployer's
permissions are split into several managed policies grouped by area (see various policy_*.tf files).
When a group approaches ~5,500 characters insize, you can split that group up into smaller policies 
and then edit main.tf to include the new file in the list of managed_policies.