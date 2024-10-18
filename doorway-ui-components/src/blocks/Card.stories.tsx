import React from "react"
import { AppearanceStyleType, LinkButton, HeadingGroup } from "@bloom-housing/ui-components"
import { BADGES } from "../../.storybook/constants"
import { Button, ButtonGroup, ButtonGroupSpacing } from "../.."
import Card from "./Card"
import CardDocumentation from "./Card.docs.mdx"

export default {
  title: "Blocks/Card 🚩",
  id: "blocks/card",
  parameters: {
    docs: {
      page: CardDocumentation,
    },
    badges: [BADGES.GEN2],
  },
}

export const TextContent = () => (
  <div style={{ maxWidth: "500px" }}>
    <Card>
      <Card.Header>
        <h3>I'm just a heading</h3>
      </Card.Header>

      <Card.Section className="markdown">
        <p>Markdown styled content here.</p>

        <ul>
          <li>List Item 1</li>
          <li>List Item 2</li>
        </ul>
      </Card.Section>

      <Card.Footer>
        <Card.Section>
          <p>Footer content here.</p>
        </Card.Section>
      </Card.Footer>
    </Card>
  </div>
)

export const MixedContent = () => (
  <div style={{ maxWidth: "500px" }}>
    <Card>
      <div>
        <figure>
          <img src="/images/listing.jpg" alt={"Image Alt"} />
        </figure>

        <Card.Header
          suffix={
            <div>
              <Button>Click</Button>
            </div>
          }
        >
          <h3 className="card-header">I'm a heading!</h3>
        </Card.Header>
      </div>

      <Card.Section>
        <p>Hello World!</p>
      </Card.Section>

      <Card.Footer>
        <ButtonGroup
          spacing={ButtonGroupSpacing.even}
          columns={[<Button styleType={AppearanceStyleType.primary}>Call to Action</Button>]}
        />
      </Card.Footer>
    </Card>
  </div>
)

export const HeaderFooterOnly = () => (
  <div style={{ maxWidth: "600px" }}>
    <Card>
      <Card.Header>
        <HeadingGroup
          headingPriority={2}
          heading="Household Maximum Income"
          subheading="To determine your eligibility for this property, choose your household size (include yourself in that calculation)."
        />
      </Card.Header>

      <Card.Footer>
        <ButtonGroup
          columns={[
            <Button>Previous</Button>,
            <Button styleType={AppearanceStyleType.primary}>Next</Button>,
          ]}
        />
        <Card.Section centered={true}>
          <LinkButton href="#" unstyled className="m-0">
            Skip this and show me listings
          </LinkButton>
        </Card.Section>
      </Card.Footer>
    </Card>
  </div>
)

export const DetroitStyle = () => {
  const cssVarsOverride = `
    .card-overrides {
      --bloom-font-sans: Montserrat;
      --bloom-font-alt-sans: var(--bloom-font-sans);
      --bloom-color-primary: rgb(41,126,115);
      --bloom-color-primary-dark: rgb(0,68,69);

      --primary-appearance-hover-background-color: white;
      --primary-appearance-hover-label-color: var(--bloom-color-primary-dark);

      --outlined-appearance-hover-background-color: var(--bloom-color-primary);
      --outlined-appearance-hover-border-color: var(--bloom-color-primary);

      font-family: var(--bloom-font-sans);
    }

    .card-overrides .heading-group > *:first-child {
      font-family: var(--bloom-font-sans);
    }

    .card-overrides .button {
      --normal-rounded: 60px;
      --normal-padding: 0.5rem 1rem;
      --normal-font-size: var(--bloom-font-size-base);
      --label-letter-spacing: normal;
      --label-transform: none;
    }
  `

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap"
        rel="stylesheet"
      ></link>
      <div className="card-overrides" style={{ maxWidth: "600px" }}>
        <Card>
          <Card.Header>
            <HeadingGroup
              headingPriority={2}
              heading="Household Maximum Income"
              subheading="To determine your eligibility for this property, choose your household size (include yourself in that calculation)."
            />
          </Card.Header>

          <Card.Section className="markdown">
            <div className="field">
              <input type="radio" name="household-size" id="one-two" />
              <label htmlFor="one-two">1-2 People</label>
            </div>
            <div className="field">
              <input type="radio" name="household-size" id="three-six" />
              <label htmlFor="three-six">3-6 People</label>
            </div>
          </Card.Section>

          <Card.Footer>
            <ButtonGroup
              columns={[
                <Button>Previous</Button>,
                <Button styleType={AppearanceStyleType.primary}>Next</Button>,
              ]}
            />
            <Card.Section centered={true}>
              <LinkButton href="#" unstyled className="m-0">
                Skip this and show me listings
              </LinkButton>
            </Card.Section>
          </Card.Footer>
        </Card>
        <style>{cssVarsOverride}</style>
      </div>
    </>
  )
}
