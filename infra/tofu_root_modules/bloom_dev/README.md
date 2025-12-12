# bloom-dev AWS account

This root module configures the bloom-dev AWS account.

- Partners site: https://partners.core-dev.bloomhousing.dev
- Public site: https://core-dev.bloomhousing.dev

## First apply

The S3 bucket for the Tofu state and the AWS certificate used need to be created before the rest of
the Bloom deployment can proceed:

1. Comment out the `backend "s3" { ... }` block at the top of [main.tf](./main.tf).
2. Run `tofu init`. This downloads the AWS tofu provider to your local system.
3. Run `tofu apply -exclude=module.bloom_deployment`. This creates a S3 bucket for the Tofu state file and
   an AWS TLS certificate.
4. Migrate the Tofu state to the s3 bucket:
   1. Uncomment the `backend "s3" { ... }` block.
   2. Run `tofu init` to migrate the state from the local file on your system to the S3 bucket.
   3. Remove the local state files: `rm terraform.tfstate terraform.tfstate.backup`.
5. Validate the AWS certificate:
   1. The `tofu apply` command from step 3 will output the DNS records that need to be added for AWS
      to issue the certificate. Add the two required CNAME records in the bloomhousing.dev DNS
      configuration (in CloudFlare). For example, the following records need to be added for the following output:

      Type | Name | Content | Proxy status
      ---|---|---|---
      CNAME | _4b8c99d969da11b1e35c36786a74b6fe.core-dev.bloomhousing.dev. | _003be6eab99411307156f79225503c77.jkddzztszm.acm-validations.aws. | disabled (DNS only)
      CNAME | _aa08a6efc0ba7025472371c5b7b44120.partners.core-dev.bloomhousing.dev. | _fc0aa55094ea4ea64f60830d3a008225.jkddzztszm.acm-validations.aws. | disabled (DNS only)

      ```
      Outputs:

      certificate_details = {
        "certificate_status" = "ISSUED"
        "expires_at" = "2026-12-18T23:59:59Z"
        "managed_renewal" = {
          "eligible" = "ELIGIBLE"
          "status" = tolist([])
        }
        "validation_dns_recods" = toset([
          {
            "domain_name" = "core-dev.bloomhousing.dev"
            "resource_record_name" = "_4b8c99d969da11b1e35c36786a74b6fe.core-dev.bloomhousing.dev."
            "resource_record_type" = "CNAME"
            "resource_record_value" = "_003be6eab99411307156f79225503c77.jkddzztszm.acm-validations.aws."
          },
          {
            "domain_name" = "partners.core-dev.bloomhousing.dev"
            "resource_record_name" = "_aa08a6efc0ba7025472371c5b7b44120.partners.core-dev.bloomhousing.dev."
            "resource_record_type" = "CNAME"
            "resource_record_value" = "_fc0aa55094ea4ea64f60830d3a008225.jkddzztszm.acm-validations.aws."
          },
        ])
      }
      ```

6. Run `tofu apply` to deploy Bloom. The output will include a `aws_lb_dns_name`. DNS CNAME records
   need to be added that point to the load balancer DNS name. For example, the following records
   need to be added for the following output:

   Type | Name | Content | Proxy status
   ---|---|---|---
   CNAME | core-dev | bloom-1787634238.us-west-2.elb.amazonaws.com | disabled (DNS only)
   CNAME | partners.core-dev | bloom-1787634238.us-west-2.elb.amazonaws.com | disabled (DNS only)

   ```
   Outputs:

   aws_lb_dns_name = "bloom-1787634238.us-west-2.elb.amazonaws.com"
   ```
