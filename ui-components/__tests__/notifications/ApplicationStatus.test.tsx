import { render, cleanup } from "@testing-library/react"
import {
  dueSoonAndVivid,
  pastDueAndVivid,
  pastDue,
  openSoon,
  openSoonVivid,
  openedAlready,
  openedWithFCFS,
  openedWithFCFSVivid,
} from "../../src/notifications/ApplicationStatus.stories"

afterEach(cleanup)

describe("<ApplicationStatus>", () => {
  it("renders as due soon", () => {
    const { getByText } = render(dueSoonAndVivid())
    expect(getByText("Application Due Date:", { exact: false })).toBeTruthy()
  })
  it("renders as past due vivid", () => {
    const { getByText } = render(pastDueAndVivid())
    expect(getByText("Applications Closed:", { exact: false })).toBeTruthy()
  })
  it("renders as past due", () => {
    const { getByText } = render(pastDue())
    expect(getByText("Applications Closed:", { exact: false })).toBeTruthy()
  })
  it("renders as open soon", () => {
    const { getByText } = render(openSoon())
    expect(getByText("Applications Open:", { exact: false })).toBeTruthy()
  })
  it("renders as open soon vivid", () => {
    const { getByText } = render(openSoonVivid())
    expect(getByText("Coming Soon:", { exact: false })).toBeTruthy()
  })
  it("renders as due soon", () => {
    const { getByText } = render(openedAlready())
    expect(getByText("Application Due Date:", { exact: false })).toBeTruthy()
  })
  it("renders as first come first serve", () => {
    const { getByText } = render(openedWithFCFS())
    expect(getByText("First Come First Serve", { exact: false })).toBeTruthy()
  })
  it("renders as first come first serve vivid", () => {
    const { getByText } = render(openedWithFCFSVivid())
    expect(getByText("First Come First Serve", { exact: false })).toBeTruthy()
  })
})
