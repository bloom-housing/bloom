import React from "react"
import { render } from "@testing-library/react"
import { listing, jurisdiction } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import { ListingCard } from "../../../src/components/browse/ListingCard"
import { getListingTags } from "../../../src/components/listing/listing_sections/MainDetails"
import {
  FeatureFlagEnum,
  ListingsStatusEnum,
  MultiselectQuestionsApplicationSectionEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import dayjs from "dayjs"

describe("<ListingCard>", () => {
  it("shows all card content", () => {
    const view = render(
      <ListingCard
        listing={{
          ...listing,
          status: ListingsStatusEnum.active,
          applicationDueDate: dayjs(new Date()).add(5, "days").toDate(),
        }}
        jurisdiction={{
          ...jurisdiction,
          featureFlags: [
            ...jurisdiction.featureFlags,
            {
              id: "id_2",
              name: FeatureFlagEnum.enableAccessibilityFeatures,
              createdAt: new Date(),
              updatedAt: new Date(),
              active: true,
              jurisdictions: [],
              description: "",
            },
          ],
        }}
      />
    )
    const tags = getListingTags(listing, true)
    expect(view.getByText(listing.name)).toBeDefined()
    expect(view.getByText("98 Archer Street, San Jose, CA 95112")).toBeDefined()
    tags.forEach((tag) => {
      expect(view.getByText(tag.title)).toBeDefined()
    })
    expect(view.getByText("Unit type")).toBeDefined()
    expect(view.getByText("Minimum income")).toBeDefined()
    expect(view.getByText("Rent")).toBeDefined()
    expect(view.getByText("First come first serve", { exact: false })).toBeDefined()
    expect(view.getByLabelText("A picture of the building")).toBeDefined()
    expect(view.getByRole("link", { name: listing.name })).toHaveAttribute(
      "href",
      `/listing/${listing.id}/${listing.urlSlug}`
    )
    expect(view.getByText("1 BR")).toBeDefined()
    expect(view.getByText("$150")).toBeDefined()
    expect(view.getByText("% of income, or up to $1,200")).toBeDefined()
  })
  it("hides reserved tag when swapCommunityTypeWithPrograms is true", () => {
    const view = render(
      <ListingCard
        listing={listing}
        jurisdiction={{
          ...jurisdiction,
          featureFlags: [
            ...jurisdiction.featureFlags,
            {
              name: FeatureFlagEnum.swapCommunityTypeWithPrograms,
              id: "id",
              createdAt: new Date(),
              updatedAt: new Date(),
              active: true,
              description: "",
              jurisdictions: [],
            },
          ],
        }}
      />
    )
    expect(view.queryByText("Veteran")).toBeNull()
  })
  it("shows programs tags when swapCommunityTypeWithPrograms is true", () => {
    const view = render(
      <ListingCard
        listing={{
          ...listing,
          listingMultiselectQuestions: [
            {
              ordinal: 1,
              multiselectQuestions: {
                id: "prog_id_1",
                createdAt: new Date(),
                updatedAt: new Date(),
                text: "Seniors 62+",
                jurisdictions: [],
                applicationSection: MultiselectQuestionsApplicationSectionEnum.programs,
              },
            },
            {
              ordinal: 2,
              multiselectQuestions: {
                id: "prog_id_2",
                createdAt: new Date(),
                updatedAt: new Date(),
                text: "Supportive Housing for the Homeless",
                jurisdictions: [],
                applicationSection: MultiselectQuestionsApplicationSectionEnum.programs,
              },
            },
          ],
        }}
        jurisdiction={{
          ...jurisdiction,
          featureFlags: [
            ...jurisdiction.featureFlags,
            {
              name: FeatureFlagEnum.swapCommunityTypeWithPrograms,
              id: "id",
              createdAt: new Date(),
              updatedAt: new Date(),
              active: true,
              description: "",
              jurisdictions: [],
            },
          ],
        }}
      />
    )
    expect(view.getByText("Seniors 62+")).toBeDefined()
    expect(view.getByText("Supportive housing for the homeless")).toBeDefined()
  })
})
