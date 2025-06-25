import { Jurisdiction, Listing } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { t } from "@bloom-housing/ui-components"
import { Button, Grid } from "@bloom-housing/ui-seeds"
import { MinimalListingCard } from "./MinimalListingCard"

interface HomeUnderConstructionProps {
  jurisdiction: Jurisdiction
  listings: Listing[]
}

export const HomeUnderConstruction = (props: HomeUnderConstructionProps) => {
  return (
    <>
      <Grid>
        <Grid.Row columns={3}>
          {props.listings.map((listing, index) => (
            <Grid.Cell key={index}>
              <MinimalListingCard listing={listing} jurisdiction={props.jurisdiction} />
            </Grid.Cell>
          ))}
        </Grid.Row>
      </Grid>
      <div className={"seeds-m-bs-content"}>
        <Button size={"sm"} variant="primary-outlined" href={"listings?availabilities=comingSoon"}>
          {t("welcome.underConstructionButton")}
        </Button>
      </div>
    </>
  )
}
