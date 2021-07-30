import React from "react"
import { render, cleanup } from "@testing-library/react"
import { ActionBlock, ActionBlockLayout } from "../../src/blocks/ActionBlock"
import { Button } from "@bloom-housing/ui-components"
import { AppearanceStyleType } from "../../src/global/AppearanceTypes"

afterEach(cleanup)

describe("<ActionBlock>", () => {
  it("can render with header & subheader", () => {
    const { getByText } = render(
      <ActionBlock
        header="My Applications"
        subheader="Subheader Text"
        icon={<span className="Action-icon"></span>}
        actions={[
          <Button
            onClick={() => console.log("click")}
            styleType={AppearanceStyleType.primary}
            key="button-1"
          >
            Action
          </Button>,
        ]}
      />
    )
    expect(getByText("My Applications")).not.toBeNull()
    expect(getByText("Subheader Text")).not.toBeNull()
    expect(getByText("Action")).not.toBeNull()
  })

  it("subheader is hidden for inline layout", () => {
    const { getByText, container } = render(
      <ActionBlock
        header="My Applications"
        subheader="Subheader Text"
        icon={<span className="Action-icon"></span>}
        layout={ActionBlockLayout.inline}
        actions={[
          <Button
            onClick={() => console.log("click")}
            styleType={AppearanceStyleType.primary}
            key="button-1"
          >
            Action
          </Button>,
        ]}
      />
    )
    expect(getByText("My Applications")).not.toBeNull()
    expect(container.getElementsByClassName("action-block__subheader").length).toBe(0)
    expect(getByText("Action")).not.toBeNull()
  })
})
