import React from "react"
import { cleanup, screen } from "@testing-library/react"
import { mockNextRouter, render } from "../../testUtils"
import {
  FeatureFlag,
  FeatureFlagEnum,
  Jurisdiction,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import Assistance from "../../../src/components/assistance/Assistance"
import { setupServer } from "msw/lib/node"

const server = setupServer()
window.scrollTo = jest.fn()

beforeAll(() => {
  server.listen()
  mockNextRouter()
})

afterEach(() => {
  server.resetHandlers()
  cleanup()
})

afterAll(() => {
  server.close()
})

describe("Assistance", () => {
  const createMockJurisdiction = (enabledFlags: FeatureFlagEnum[] = []): Jurisdiction =>
    ({
      id: "id1",
      featureFlags: enabledFlags.map(
        (flag) =>
          ({
            name: flag,
            active: true,
          } as FeatureFlag)
      ),
    } as Jurisdiction)

  it("renders housing basics card when enableHousingBasics flag is enabled", () => {
    const jurisdiction = createMockJurisdiction([FeatureFlagEnum.enableHousingBasics])
    render(<Assistance jurisdiction={jurisdiction} />)

    expect(
      screen.getByRole("heading", { name: "How to apply to affordable housing", level: 2 })
    ).toBeInTheDocument()
    expect(
      screen.queryByRole("heading", {
        name: "Additional housing opportunities and resources",
        level: 2,
      })
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole("heading", { name: "Frequently asked questions", level: 2 })
    ).not.toBeInTheDocument()
  })

  it("renders FAQ card when enableFaq flag is enabled", () => {
    const jurisdiction = createMockJurisdiction([FeatureFlagEnum.enableFaq])
    render(<Assistance jurisdiction={jurisdiction} />)

    expect(
      screen.getByRole("heading", { name: "Frequently asked questions", level: 2 })
    ).toBeInTheDocument()
    expect(
      screen.queryByRole("heading", {
        name: "Additional housing opportunities and resources",
        level: 2,
      })
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole("heading", { name: "How to apply to affordable housing", level: 2 })
    ).not.toBeInTheDocument()
  })

  it("renders resources card when enableResources flag is enabled", () => {
    const jurisdiction = createMockJurisdiction([FeatureFlagEnum.enableResources])
    render(<Assistance jurisdiction={jurisdiction} />)

    expect(
      screen.getByRole("heading", {
        name: "Additional housing opportunities and resources",
        level: 2,
      })
    ).toBeInTheDocument()
    expect(
      screen.queryByRole("heading", { name: "Frequently asked questions", level: 2 })
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole("heading", { name: "How to apply to affordable housing", level: 2 })
    ).not.toBeInTheDocument()
  })

  it("renders all cards when all feature flags are enabled", () => {
    const jurisdiction = createMockJurisdiction([
      FeatureFlagEnum.enableHousingBasics,
      FeatureFlagEnum.enableFaq,
      FeatureFlagEnum.enableResources,
    ])
    render(<Assistance jurisdiction={jurisdiction} />)

    expect(
      screen.getByRole("heading", { name: "How to apply to affordable housing", level: 2 })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("heading", { name: "Frequently asked questions", level: 2 })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("heading", {
        name: "Additional housing opportunities and resources",
        level: 2,
      })
    ).toBeInTheDocument()
  })
})
