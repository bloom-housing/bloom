import React from "react"
import { AppearanceStyleType, Button, ButtonGroup, Heading, LinkButton } from "../.."
import Card from "./Card"

export default {
  title: "Blocks/Card",
}

export const Standard = () => (
  <div style={{ maxWidth: "500px" }}>
    <Card>
      <Card.Header>
        <Heading style="cardHeader" priority={3}>
          I'm a heading!
        </Heading>
        <Button>Action</Button>
      </Card.Header>

      <Card.Section>
        <p>Hello World!</p>
      </Card.Section>

      <Card.Footer>
        <ButtonGroup
          columns={[
            <Button>Previous</Button>,
            <Button styleType={AppearanceStyleType.primary}>Next</Button>,
          ]}
        />
        <Card.Section centered>
          <LinkButton href="#" unstyled className="m-0">
            Skip this and show me listings
          </LinkButton>
        </Card.Section>
      </Card.Footer>
    </Card>
  </div>
)

export const OnlyContent = () => (
  <div style={{ maxWidth: "500px" }}>
    <Card>
      <Card.Header>
        <Heading priority={3}>I'm a heading!</Heading>
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
