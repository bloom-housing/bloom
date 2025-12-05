# Apply Deployer Permission Set Open Tofu Modules

TODO These steps will create the following resources:

```mermaid
graph TB
  subgraph ORG[AWS Organization]
      direction TB

      subgraph MA[AWS Management Account]
          direction TB

          S3[Bloom Tofu State Files<br/>AWS S3 Bucket]

          subgraph IC[AWS IAM Identity Center]
          end
      end
      subgraph DEV[bloom-dev Account]
      end
      subgraph PROD[bloom-prod Account]
      end
  end

  subgraph LEGEND
      direction LR

      PREREQ[Pre-requisite]
      CREATED[Created]

      PREREQ ~~~ CREATED
  end

  %% Invisible link to position legend at top
  LEGEND ~~~ ORG

  %% Blue for manually created
  classDef manual fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
  %% Green for Terraform created
  classDef terraform fill:#e8f5e9,stroke:#388e3c,stroke-width:2px
  %% Dashed border for prerequisites
  classDef prerequisite fill:#fff,stroke:#666,stroke-width:2px,stroke-dasharray: 5 5
  %% Legend container style
  classDef legendStyle fill:#fff,stroke:#333,stroke-width:1px

  %% Apply prerequisite style to org structure
  class ORG,MA,IC,PREREQ prerequisite

  %% Apply legend style
  class LEGEND legendStyle

  %% Apply manual style (blue)
  class HUMANS,GRP_DEVELOPERS,GRP_PROD_DEPLOYERS,GRP_PROD_IAM,PS_DEV_IAM,PS_PROD_IAM,PS_DEV,PS_PROD,DEV,PROD,CREATED,S3 manual

  %% Apply terraform style (green)
  class POL_DEV_INLINE,POL_PROD_INLINE,L3 terraform
```

*Diagram created by prompting Claude Opus 4.1 and manually edited.*

## Before these steps

## Steps

## After these steps
