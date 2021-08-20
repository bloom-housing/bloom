import React from "react"
import { render, cleanup, getByTestId } from "@testing-library/react"
import { Modal } from "../../src/overlays/Modal"

afterEach(cleanup)

describe("<Modal>", () => {
  it("renders with string content", () => {
    const portalRoot = document.createElement("div")
    portalRoot.setAttribute("id", "__next")
    document.body.appendChild(portalRoot)
    const { getByText, debug, getByRole } = render(
      <Modal
        open={true}
        title={"Modal Title"}
        onClose={() => {}}
        ariaDescription={"My Modal"}
        actions={[<div key={0}>Action 1</div>, <div key={1}>Action 2</div>]}
      >
        Modal Children
      </Modal>
    )
    expect(getByRole("dialog")).toBeTruthy()
    expect(getByText("Modal Title")).toBeTruthy()
    expect(getByText("Modal Children")).toBeTruthy()
    expect(getByText("Action 1")).toBeTruthy()
    expect(getByText("Action 2")).toBeTruthy()
  })
  it("renders with JSX content", () => {
    const portalRoot = document.createElement("div")
    portalRoot.setAttribute("id", "__next")
    document.body.appendChild(portalRoot)
    const { getByText, getByRole } = render(
      <Modal
        open={true}
        title={"Modal Title"}
        onClose={() => {}}
        ariaDescription={"My Modal"}
        actions={[<div key={0}>Action 1</div>, <div key={1}>Action 2</div>]}
      >
        <strong>Modal Children</strong>
      </Modal>
    )
    expect(getByRole("dialog")).toBeTruthy()
    expect(getByText("Modal Title")).toBeTruthy()
    expect(getByText("Modal Children")).toBeTruthy()
    expect(getByText("Action 1")).toBeTruthy()
    expect(getByText("Action 2")).toBeTruthy()
  })
  it("does not render footer with no actions", () => {
    const portalRoot = document.createElement("div")
    portalRoot.setAttribute("id", "__next")
    document.body.appendChild(portalRoot)
    const { queryByTestId } = render(
      <Modal open={true} title={"Modal Title"} onClose={() => {}} ariaDescription={"My Modal"}>
        <strong>Modal Children</strong>
      </Modal>
    )
    expect(queryByTestId("footer")).toBeFalsy()
  })
})
