import React from "react"
import { render, cleanup } from "@testing-library/react"
import { AppearanceStyleType, LinkButton, HeadingGroup } from "@bloom-housing/ui-components"
import { Card } from "../../src/blocks/Card"
import { Button } from "../../src/actions/Button"
import { ButtonGroup } from "../../src/actions/ButtonGroup"

afterEach(cleanup)

describe("<Card>", () => {
  it("renders text structure", () => {
    const { getByText } = render(
      <Card>
        <Card.Header>
          <h3>I'm just a heading</h3>
        </Card.Header>

        <Card.Section className="markdown">
          <p>Markdown styled content here.</p>
        </Card.Section>

        <Card.Footer>
          <Card.Section>
            <p>Footer content here.</p>
          </Card.Section>
        </Card.Footer>
      </Card>
    )

    expect(getByText("I'm just a heading")).toBeTruthy()
    expect(getByText("Markdown styled content here.")).toBeTruthy()
    expect(getByText("Footer content here.")).toBeTruthy()
  })

  it("properly adds jumplink ids", () => {
    const { getByText } = render(<Card jumplinkData={{ title: "I like cheese" }}>test</Card>)
    expect(getByText("test").id).toEqual("i-like-cheese-section")
  })

  it("renders headers and buttons", () => {
    const { getByText } = render(
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
    )

    expect(getByText("Household Maximum Income")).toBeTruthy()
    expect(
      getByText(
        "To determine your eligibility for this property, choose your household size (include yourself in that calculation)."
      )
    ).toBeTruthy()
    expect(getByText("Previous")).toBeTruthy()
    expect(getByText("Next")).toBeTruthy()
    expect(getByText("Skip this and show me listings")).toBeTruthy()
  })
})
