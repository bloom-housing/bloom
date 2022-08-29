import React from "react"
import { withKnobs, boolean } from "@storybook/addon-knobs"
import { AppearanceStyleType, Button, ButtonGroup, Heading } from "../../.."
import CardContainer from "./CardContainer"

export default {
  title: "Prototypes/Card Container",
}

export const Standard = () => (
  <div style={{ maxWidth: "500px" }}>
    <article className="card-prototype">
      <CardContainer headerTop={boolean("Header on Top", false)}>
        <CardContainer.Header>
          <Heading style="cardHeader" priority={3}>
            I'm a heading!
          </Heading>
          <Button unstyled>[CLOSE]</Button>
        </CardContainer.Header>

        <CardContainer.Image>
          <img src="/images/listing.jpg" />
        </CardContainer.Image>

        <CardContainer.Section>
          <p>Hello</p>
          <p>Folks!</p>
        </CardContainer.Section>

        <CardContainer.Section>
          <img src="/images/listing.jpg" />
        </CardContainer.Section>

        <CardContainer.Footer>
          <ButtonGroup
            columns={[
              <Button>Previous</Button>,
              <Button styleType={AppearanceStyleType.primary}>Next</Button>,
            ]}
          />
        </CardContainer.Footer>
      </CardContainer>
    </article>
    <div className="card-prototype card-appendix">
      <Button>Do Stuff</Button>
    </div>
  </div>
)

export const AsRow = () => (
  <div style={{ maxWidth: "1200px" }}>
    <article className="card-prototype">
      <CardContainer row={true}>
        <CardContainer.Image>
          <img
            src="/images/listing.jpg"
            style={{ minWidth: "100px", objectFit: "cover", maxWidth: "200px" }}
          />
        </CardContainer.Image>
        <CardContainer.Header>
          <Heading priority={3}>I'm a heading with a whole lot of text</Heading>
        </CardContainer.Header>
        <CardContainer.Footer>
          <ButtonGroup
            columns={[
              <Button styleType={AppearanceStyleType.primary} slot="footer">
                <span style={{ whiteSpace: "nowrap" }}>Do Stuff</span>
              </Button>,
            ]}
          />
        </CardContainer.Footer>
      </CardContainer>
    </article>
  </div>
)
