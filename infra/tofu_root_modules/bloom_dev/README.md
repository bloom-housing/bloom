# bloom-dev AWS account

This root module configures the bloom-dev AWS account.


## First apply

The results of `tofu apply` commands are stored in a state file which will be stored in a S3 bucket
inside the created AWS account. The bucket will not exist until after the first apply command,
however, so the following procedure must be followed:

1. Comment out the `backend "s3" { ... }` block at the top of [main.tf](./main.tf).
2. Run `tofu init`. This downloads the AWS tofu provider to your local system.
3. Run `tofu apply`. This creates the new AWS account and S3 bucket. The state is stored in a local
   file on your system.
4. Uncomment the `backend "s3" { ... }` block.
5. Run `tofu init` to migrate the state from the local file on your system to the S3 bucket.
6. Remove the local state files: `rm terraform.tfstate terraform.tfstate.backup`.
