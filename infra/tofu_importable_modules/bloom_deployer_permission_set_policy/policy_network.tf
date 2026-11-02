# VPC, load balancer and certificate permissions.
data "aws_iam_policy_document" "network" {
  statement {
    # Allow creating ServiceLinkedRole for ECS and ELB.
    actions = [
      "iam:CreateServiceLinkedRole",
      "iam:DeleteServiceLinkedRole",
      "iam:GetRole",
      "iam:GetServiceLinkedRoleDeletionStatus",
    ]
    resources = [
      "arn:aws:iam::${var.bloom_deployment_aws_account_number}:role/aws-service-role/ecs.amazonaws.com/AWSServiceRoleForECS",
      "arn:aws:iam::${var.bloom_deployment_aws_account_number}:role/aws-service-role/elasticloadbalancing.amazonaws.com/AWSServiceRoleForElasticLoadBalancing",
    ]
  }
  statement {
    # Describe calls are not scoped to a specific resource.
    actions = [
      "acm:ListCertificates",
      "ec2:Describe*",
      "elasticloadbalancing:Describe*",
    ]
    resources = ["*"]
  }
  statement {
    # Configure the Bloom VPC.
    actions = [
      "acm:DeleteCertificate",
      "acm:DescribeCertificate",
      "acm:GetCertificate",
      "acm:ListTagsForCertificate",
      "acm:RequestCertificate",
      "ec2:AllocateAddress",
      "ec2:AssociateRouteTable",
      "ec2:AssociateVpcCidrBlock",
      "ec2:AttachInternetGateway",
      "ec2:AuthorizeSecurityGroupEgress",
      "ec2:AuthorizeSecurityGroupIngress",
      "ec2:CreateInternetGateway",
      "ec2:CreateNatGateway",
      "ec2:CreateRoute",
      "ec2:CreateRouteTable",
      "ec2:CreateSecurityGroup",
      "ec2:CreateSubnet",
      "ec2:CreateTags",
      "ec2:CreateVpc",
      "ec2:CreateVpcEndpoint",
      "ec2:CreateVpcPeeringConnection",
      "ec2:DeleteInternetGateway",
      "ec2:DeleteNatGateway",
      "ec2:DeleteRoute",
      "ec2:DeleteRouteTable",
      "ec2:DeleteSecurityGroup",
      "ec2:DeleteSubnet",
      "ec2:DeleteVPC",
      "ec2:DeleteVpcEndpoints",
      "ec2:DeleteVpcPeeringConnection",
      "ec2:DescribeVpcAttribute",
      "ec2:DetachInternetGateway",
      "ec2:DisassociateRouteTable",
      "ec2:DisassociateVpcCidrBlock",
      "ec2:ModifySecurityGroupRules",
      "ec2:ModifySubnetAttribute",
      "ec2:ModifyVpcAttribute",
      "ec2:ModifyVpcEndpoint",
      "ec2:ReleaseAddress",
      "ec2:RevokeSecurityGroupEgress",
      "ec2:RevokeSecurityGroupIngress",
      "elasticloadbalancing:AddTags",
      "elasticloadbalancing:CreateListener",
      "elasticloadbalancing:CreateLoadBalancer",
      "elasticloadbalancing:CreateRule",
      "elasticloadbalancing:CreateTargetGroup",
      "elasticloadbalancing:DeleteListener",
      "elasticloadbalancing:DeleteLoadBalancer",
      "elasticloadbalancing:DeleteRule",
      "elasticloadbalancing:DeleteTargetGroup",
      "elasticloadbalancing:ModifyListener",
      "elasticloadbalancing:ModifyLoadBalancerAttributes",
      "elasticloadbalancing:ModifyTargetGroup",
      "elasticloadbalancing:ModifyTargetGroupAttributes",
    ]
    resources = [
      "arn:aws:acm:${local.region_account}:certificate/*",
      "arn:aws:ec2:${local.region_account}:elastic-ip/*",
      "arn:aws:ec2:${local.region_account}:internet-gateway/*",
      "arn:aws:ec2:${local.region_account}:natgateway/*",
      "arn:aws:ec2:${local.region_account}:route-table/*",
      "arn:aws:ec2:${local.region_account}:security-group-rule/*",
      "arn:aws:ec2:${local.region_account}:security-group/*",
      "arn:aws:ec2:${local.region_account}:subnet/*",
      "arn:aws:ec2:${local.region_account}:vpc-endpoint/*",
      "arn:aws:ec2:${local.region_account}:vpc-peering-connection/*",
      "arn:aws:ec2:${local.region_account}:vpc/*",
      "arn:aws:elasticloadbalancing:${local.region_account}:listener-rule/app/bloom/*",
      "arn:aws:elasticloadbalancing:${local.region_account}:listener/app/bloom/*",
      "arn:aws:elasticloadbalancing:${local.region_account}:loadbalancer/app/bloom/*",
      "arn:aws:elasticloadbalancing:${local.region_account}:targetgroup/bloom-site-partners/*",
      "arn:aws:elasticloadbalancing:${local.region_account}:targetgroup/bloom-site-public/*",
    ]
  }
  statement {
    actions = ["ec2:DisassociateAddress"]
    # For some reason the DisassociateAdress calls use this resource pattern.
    resources = ["arn:aws:ec2:${local.region_account}:*/*"]
  }
}
