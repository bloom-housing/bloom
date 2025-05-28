import { Jurisdiction, Listing } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { GridCell } from "@bloom-housing/ui-components"
import { Grid } from "@bloom-housing/ui-seeds"
import { GridRow } from "@bloom-housing/ui-seeds/src/layout/Grid"
import { MinimalListingCard } from "./MinimalListingCard"

interface HomeUnderConstructionProps {
  jurisdiction: Jurisdiction
  listings: Listing[]
}

export const HomeUnderConstruction = (props: HomeUnderConstructionProps) => {
  return (
    <Grid>
      <GridRow columns={3}>
        {props.listings.map((listing, index) => (
          <GridCell key={index}>
            <MinimalListingCard listing={listing} jurisdiction={props.jurisdiction} />
          </GridCell>
        ))}
      </GridRow>
    </Grid>
  )
}
