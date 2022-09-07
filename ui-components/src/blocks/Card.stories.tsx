import React from "react"
import { BADGES } from "../../.storybook/constants"
import { AppearanceStyleType, Button, ButtonGroup, ButtonGroupSpacing, LinkButton } from "../.."
import { HeadingGroup } from "../headers/HeadingGroup"
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
          <img src="/images/listing.jpg" />
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

    .card-overrides h2 {
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
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
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

export const CustomWackyCard = () => {
  const wackyStyles = `
    .wacky-card {
      --background-color: lightyellow;
      --border-color: maroon;
      --border-radius: 20px;
      --content-margin-inline-desktop: 1.3rem;
      --border-width: 3px;
      --rule-width: 6px;
      --rule-color: forestgreen;

      color: var(--bloom-color-secondary);
      box-shadow: var(--bloom-shadow-md);
    }

    .wacky-card > .card__header > * {
      font-family: cursive;
      font-size: 200%;
      letter-spacing: var(--bloom-letter-spacing-wider);
      color: var(--bloom-color-alert-dark);
    }

    .wacky-card .markdown {
      font-family: var(--bloom-font-serif);
    }
  `

  return (
    <div style={{ maxWidth: "500px" }}>
      <article className="wacky-card card">
        <Card.Header>
          <h3>This is totally custom!</h3>
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
            <div className="field text-center font-bold">
              <input type="checkbox" id="good" checked />
              <label htmlFor="good">Looks good! 😜👍</label>
            </div>
          </Card.Section>
        </Card.Footer>
      </article>
      <style>{wackyStyles}</style>
    </div>
  )
}
