import * as React from "react"
import { Listing } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { ZeroListingsItem } from "@bloom-housing/doorway-ui-components"
import { LoadingOverlay, t, InfoCard, LinkButton } from "@bloom-housing/ui-components"
import { getListings } from "../../lib/helpers"
import { Pagination } from "./Pagination"
import styles from "./ListingsCombined.module.scss"
import deprecatedStyles from "./ListingsCombinedDeprecated.module.scss"
import CustomSiteFooter from "../shared/CustomSiteFooter"

type ListingsListProps = {
  listings: Listing[]
  currentPage: number
  lastPage: number
  onPageChange: (page: number) => void
  loading: boolean
}

const ListingsList = (props: ListingsListProps) => {
  const listingsDiv = (
    <div id="listingsList">
      {props.listings.length > 0 || props.loading ? (
        <div className="listingsList">
          {getListings(
            props.listings.map((listing, index) => {
              return { ...listing, name: `${index + 1}. ${listing.name}` }
            })
          )}
        </div>
      ) : (
        <ZeroListingsItem
          title={t("t.noMatchingListings")}
          description={t("t.tryRemovingFilters")}
        />
      )}
    </div>
  )

  const infoCards = (
    <div>
      {process.env.notificationsSignUpUrl && (
        <InfoCard
          title={t("t.signUpForAlerts")}
          subtitle={t("t.subscribeToListingAlerts")}
          className="is-normal-primary-lighter"
        >
          <LinkButton
            href={process.env.notificationsSignUpUrl}
            newTab={true}
            className="is-primary"
          >
            {t("t.signUp")}
          </LinkButton>
        </InfoCard>
      )}
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
  )

  const pagination =
    props.lastPage != 0 ? (
      <Pagination
        currentPage={props.currentPage}
        lastPage={props.lastPage}
        onPageChange={props.onPageChange}
      />
    ) : (
      <></>
    )
  return (
    <>
      <div
        className={`${styles["listings-list-wrapper"]} ${deprecatedStyles["listings-list-wrapper-deprecated"]}`}
      >
        <LoadingOverlay isLoading={props.loading}>{listingsDiv}</LoadingOverlay>
        {pagination}
        {infoCards}
        <CustomSiteFooter />
      </div>
    </>
  )
}
export { ListingsList as default, ListingsList }
