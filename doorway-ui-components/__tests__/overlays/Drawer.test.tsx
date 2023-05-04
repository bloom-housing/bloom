import React from "react"
import { render, cleanup } from "@testing-library/react"
import { Drawer, DrawerSide } from "../../src/overlays/Drawer"

afterEach(cleanup)

describe("<Drawer>", () => {
  it("can render without error", () => {
    const portalRoot = document.createElement("div")
    portalRoot.setAttribute("id", "__next")
    document.body.appendChild(portalRoot)
    const { getByText } = render(
      <Drawer
        open={true}
        title={"Drawer Title"}
        onClose={jest.fn()}
        ariaDescription={"My Drawer"}
        actions={[<div key={0}>Action 1</div>, <div key={1}>Action 2</div>]}
      >
        Drawer Children
      </Drawer>
    )
    expect(getByText("Drawer Title")).toBeTruthy()
    expect(getByText("Drawer Children")).toBeTruthy()
    expect(getByText("Action 1")).toBeTruthy()
    expect(getByText("Action 2")).toBeTruthy()
  })
  it("can render with a custom class", () => {
    const portalRoot = document.createElement("div")
    portalRoot.setAttribute("id", "__next")
    document.body.appendChild(portalRoot)
    render(
      <Drawer
        open={true}
        title={"Drawer Title"}
        onClose={jest.fn()}
        ariaDescription={"My Drawer"}
        className={"custom-class"}
        direction={DrawerSide.left}
      >
        Drawer Children
      </Drawer>
    )
    expect(document.getElementsByClassName("custom-class").length).toBe(1)
  })
})
