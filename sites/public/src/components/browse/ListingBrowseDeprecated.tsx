import React, { useEffect, useContext } from "react"
import { Listing } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { ListingList, pushGtmEvent, AuthContext } from "@bloom-housing/shared-helpers"
import { ListingsGroup, PageHeader, t } from "@bloom-housing/ui-components"
import { getListings } from "../../lib/helpers"
import { UserStatus } from "../../lib/constants"
import Layout from "../../layouts/application"

export interface ListingBrowseDeprecatedProps {
  openListings: Listing[]
  closedListings: Listing[]
}

const openListings = (listings) => {
  return listings?.length > 0 ? (
    <>{getListings(listings)}</>
  ) : (
    <div className="notice-block">
      <h3 className="m-auto text-gray-800">{t("listings.noOpenListings")}</h3>
    </div>
  )
}

const closedListings = (listings) => {
  return (
    listings?.length > 0 && (
      <ListingsGroup
        listingsCount={listings.length}
        header={t("listings.closedListings")}
        hideButtonText={t("listings.hideClosedListings")}
        showButtonText={t("listings.showClosedListings")}
      >
        {getListings(listings)}
      </ListingsGroup>
    )
  )
}

export const ListingBrowseDeprecated = (props: ListingBrowseDeprecatedProps) => {
  const { profile } = useContext(AuthContext)
  const metaDescription = t("pageDescription.welcome", { regionName: t("region.name") })
  const metaImage = "" // TODO: replace with hero image

  useEffect(() => {
    pushGtmEvent<ListingList>({
      event: "pageView",
      pageTitle: "Rent Affordable Housing - Housing Portal",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
      numberOfListings: props.openListings.length,
      listingIds: props.openListings.map((listing) => listing.id),
    })
  }, [profile, props.openListings])

  return (
    <Layout pageTitle={t("pageTitle.rent")} metaImage={metaImage} metaDescription={metaDescription}>
      <PageHeader title={t("pageTitle.rent")} />
      <div>
        {openListings(props.openListings)}
        {closedListings(props.closedListings)}
      </div>
    </Layout>
  )
}
