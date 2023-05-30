import * as React from "react"
import { getListings } from "../../lib/helpers"
import { Listing } from "@bloom-housing/backend-core"
import {
  Button,
  InfoCard,
  LinkButton,
  ZeroListingsItem,
  t,
} from "@bloom-housing/doorway-ui-components"
import { Pagination } from "./Pagination"

type ListingsListProps = {
  listings: Listing[]
  currentPage: number
  lastPage: number
  onPageChange: (page: number) => void
}

const ListingsList = (props: ListingsListProps) => {
  const listingsDiv =
    props.listings.length > 0 ? (
      <div className="listingsList">{getListings(props.listings)}</div>
    ) : (
      <ZeroListingsItem title={t("t.noMatchingListings")} description={t("t.tryRemovingFilters")}>
        <Button>{t("t.clearAllFilters")}</Button>
      </ZeroListingsItem>
    )

  const infoCards =
    props.currentPage == props.lastPage ? (
      <div>
        <InfoCard
          title={t("t.signUpForAlerts")}
          subtitle={t("t.subscribeToNewsletter")}
          className="is-normal-primary-lighter"
        >
          <LinkButton
            href="https://public.govdelivery.com/accounts/CAMTC/signup/36832"
            newTab={true}
            className="is-primary"
          >
            {t("t.signUp")}
          </LinkButton>
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
    ) : (
      <div></div>
    )

  return (
    <div>
      {listingsDiv}
      <Pagination
        currentPage={props.currentPage}
        lastPage={props.lastPage}
        onPageChange={props.onPageChange}
      />
      {infoCards}
    </div>
  )
}
export { ListingsList as default, ListingsList }
