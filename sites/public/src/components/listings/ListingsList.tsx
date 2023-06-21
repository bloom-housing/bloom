import React, { useState, useEffect } from "react"
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
  setClearButtonState?: (boolean) => void
  clearButtonState?: boolean
}

const ListingsList = (props: ListingsListProps) => {
  // Flip the state and call the callers setClearButtonState,
  // which is intended to cause a reset on the filters
  // and then reload the page with no query filters applied.
  const [initialClear, setInitialClear] = useState(props.clearButtonState)
  const { setClearButtonState } = props
  useEffect(() => {
    // On state change, use the function the caller passed in with the new state.
    if (!setClearButtonState) {
      return
    }
    setClearButtonState(initialClear)
  }, [initialClear, setClearButtonState])
  const clearFilter = () => {
    // Invert the state stored in this component.
    setInitialClear(!initialClear)
  }

  const listingsDiv =
    props.listings.length > 0 ? (
      <div className="listingsList">{getListings(props.listings)}</div>
    ) : (
      <ZeroListingsItem title={t("t.noMatchingListings")} description={t("t.tryRemovingFilters")}>
        <Button onClick={clearFilter}>{t("t.clearAllFilters")}</Button>
      </ZeroListingsItem>
    )

  const infoCards =
    props.currentPage == props.lastPage ? (
      <div>
        <InfoCard
          title={t("t.signUpForAlerts")}
          subtitle={t("t.subscribeToListingAlerts")}
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
          <LinkButton href="/help/housing-help" className="is-secondary">
            {t("t.helpCenter")}
          </LinkButton>
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
