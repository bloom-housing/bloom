import * as React from "react"
import { getListings } from "../../lib/helpers"
import { Listing } from "@bloom-housing/backend-core"
import { Button, InfoCard, LinkButton, t } from "@bloom-housing/doorway-ui-components"

type ListingsListProps = {
  listings: Listing[]
}

const ListingsList = (props: ListingsListProps) => {
  return (
    <div>
      <div className="listingsList">{getListings(props.listings)}</div>
      {/* TODO: once pagination is implemented for listings, the following should only show on the last page. */}
      <InfoCard
        title={t("t.signUpForAlerts")}
        subtitle={t("t.subscribeToNewsletter")}
        className="is-normal-primary-lighter"
      >
        <Button className="is-primary">{t("t.signUp")}</Button>
      </InfoCard>
      <InfoCard
        title={t("t.needHelp")}
        subtitle={t("t.emergencyShelter")}
        className="is-normal-secondary-lighter"
      >
        <Button className="is-secondary">{t("t.helpCenter")}</Button>
      </InfoCard>
      <InfoCard
        title={t("t.housingInSanFrancisco")}
        subtitle={t("t.seeSanFranciscoListings")}
        className="is-normal-secondary-lighter"
      >
        <LinkButton href="https://housing.sfgov.org/" newTab={true} className="is-secondary">
          {t("t.seeListings")}
        </LinkButton>
      </InfoCard>
    </div>
  )
}
export { ListingsList as default, ListingsList }
