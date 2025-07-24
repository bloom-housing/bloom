import React, { useContext } from "react"
import { t } from "@bloom-housing/ui-components"
import { FieldValue, Grid } from "@bloom-housing/ui-seeds"
import { ListingContext } from "../../ListingContext"
import { getDetailFieldString } from "./helpers"
import SectionWithGrid from "../../../shared/SectionWithGrid"

const DetailListingIntro = () => {
  const listing = useContext(ListingContext)

  return (
    <SectionWithGrid heading={t("listings.sections.introTitle")} inset>
      <Grid.Row>
        <Grid.Cell>
          <FieldValue id="name" label={t("listings.listingName")}>
            {getDetailFieldString(listing.name)}
          </FieldValue>
        </Grid.Cell>
      </Grid.Row>
      <Grid.Row>
        <Grid.Cell>
          <FieldValue id="jurisdictions.name" label={t("t.jurisdiction")}>
            {getDetailFieldString(listing.jurisdictions.name)}
          </FieldValue>
        </Grid.Cell>
        <Grid.Cell>
          <FieldValue id="developer" label={t("listings.developer")}>
            {getDetailFieldString(listing.developer)}
          </FieldValue>
        </Grid.Cell>
      </Grid.Row>
    </SectionWithGrid>
  )
}

export default DetailListingIntro
