# bloom-genai-test AWS account

This root module configures the Bloom Data Explorer backend along with the rest of Bloom.

This readme assumes you are doing this in a dev environment. For ease of use, from the root of the Bloom repo, run:
`alias bloomtofu="docker container run --rm -it --user $(id -u):$(id -g) -v ${PWD}/infra:/infra:z -v ${HOME}/.aws/sso/cache:/home/.aws/sso/cache:z -v ${HOME}/.aws/cli:/home/.aws/cli ghcr.io/bloom-housing/bloom/infra-dev"`

If you want to run tofu locally, just replace things like `bloomtofu -ss apply` with `tofu apply`.

## Prerequisite

1. In the AWS account, manually create a secret in AWS Secrets Manager that contains the JSON contents of
what would be in a gcp-sa.json file that connects to a valid Vertex AI instance. Note the ARN of this resource.
2. You have two choices. Either export this value into a variable, and pass it in on each `bloomtofu` command, such as `bloomtofu -ss -si bloom_genai apply -var="vertex_credentials_json_secret_arn=${VERTEX_CREDS_ARN}"`. Or, you can set the default in (./main.tf)[main.tf] to avoid having to provide it each time. These instructions will assume the latter for conciseness.
3. Initialize and authenticate with AWS. Run `bloomtofu bloom_genai -version` and follow the instructions to authenticate with AWS.

## First apply - certificate

The AWS certificate needs to be created and validated before the rest of the Bloom deployment can be
applied. So, when applying to a fresh account, run:

`bloomtofu -ss -si bloom_genai apply -exclude=module.bloom_deployment -exclude=module.data_explorer_backend`

See the instructions in [Apply Bloom Deployment Open Tofu
Modules](../../aws_deployment_guide/6_apply_bloom_deployment_tofu_modules.md) for full instructions.

## Second apply - seeding

For the intial deployment, you need to not only seed the Bloom database, but the Data Explorer backend database as well. You will need to use the generated SQL file from `bin/import-data` in the (https://github.com/exygy/housing-reports)[housing-reports repo].

1. Place the generated data import file at `infra/data_to_import.sql`.
2. `bloomtofu -ss -si bloom_genai apply -var='bootstrap_db=true' -var='apply_seed=true' -var='seed_sql_path=/infra/data_to_import.sql' -var='bloom_apply_seed=true'`.

## Third apply - stable deployment

From this point onward, a simple apply with the vertex credentials var should be sufficient to update the server pieces. You'll want to do this at least once to remove the seeding artifacts.

`bloomtofu -ss -si apply`

## Updating data import

To update the data in the data explorer database, you just need to provide the SQL file containing the data import and run the following.

`bloomtofu -ss -si bloom_genai apply -var="vertex_credentials_json_secret_arn=${VERTEX_CREDS_ARN}" -var='bootstrap_db=true' -var='apply_seed=true' -var='seed_sql_path=/infra/data_to_import.sql'`

## Permissions changes

A fair number of extra permissions need to be added to the deployer role. To be documented later.

## Notes

If you're developing on this and are repeatedly applying and destroying, it's helpful to do:
`bloomtofu -ss -si bloom_genai destroy -exclude=aws_acm_certificate.bloom` so that you can skip the cert generation step and don't need to repeatedly update DNS.
