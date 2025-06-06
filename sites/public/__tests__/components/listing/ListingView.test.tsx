import React from "react"
import dayjs from "dayjs"
import { render } from "@testing-library/react"
import { ListingView } from "../../../src/components/listing/ListingView"
import { listing, jurisdiction } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import { ApplicationMethodsTypeEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { AuthContext } from "@bloom-housing/shared-helpers"

describe("<ListingView>", () => {
  describe("'Apply Online' button visibility", () => {
    it("does not show if the due date is in the past", () => {
      const pastDate = dayjs().subtract(7, "day").toDate()
      const view = render(
        <AuthContext.Provider
          value={{
            doJurisdictionsHaveFeatureFlagOn: () => true,
          }}
        >
          <ListingView
            listing={{
              ...listing,
              applicationDueDate: pastDate,
            }}
            jurisdiction={jurisdiction}
          />
        </AuthContext.Provider>
      )
      expect(view.getByText(/Applications Closed/)).toBeInTheDocument()
      expect(view.queryByText("Apply Online")).toBeNull()
    })

    it("shows if the due date is in the future", () => {
      const futureDate = dayjs().add(7, "day").toDate()
      const view = render(
        <AuthContext.Provider
          value={{
            doJurisdictionsHaveFeatureFlagOn: () => true,
          }}
        >
          <ListingView
            listing={{
              ...listing,
              applicationDueDate: futureDate,
            }}
            jurisdiction={jurisdiction}
          />
        </AuthContext.Provider>
      )
      expect(view.getByText("Apply Online")).toBeInTheDocument()
    })

    it("does not show for paper applications even with a future due date", () => {
      const futureDate = dayjs().add(7, "day").toDate()
      const view = render(
        <AuthContext.Provider
          value={{
            doJurisdictionsHaveFeatureFlagOn: () => true,
          }}
        >
          <ListingView
            listing={{
              ...listing,
              applicationDueDate: futureDate,
              applicationMethods: [
                {
                  ...listing.applicationMethods[0],
                  type: ApplicationMethodsTypeEnum.PaperPickup,
                },
              ],
            }}
            jurisdiction={jurisdiction}
          />
        </AuthContext.Provider>
      )
      expect(view.queryByText("Apply Online")).toBeNull()
    })
  })
})
