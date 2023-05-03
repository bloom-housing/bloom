import React, { useEffect, useContext } from "react"
import Head from "next/head"
import { PageHeader, t } from "@bloom-housing/ui-components"
import { Listing } from "@bloom-housing/backend-core/types"
import { ListingList, pushGtmEvent, AuthContext } from "@bloom-housing/shared-helpers"
import { UserStatus } from "../lib/constants"
import Layout from "../layouts/application"
import { MetaTags } from "../components/shared/MetaTags"
import { ListingsCombined } from "../components/listings/ListingsCombined"
import { fetchOpenListings } from "../lib/hooks"

export interface ListingsProps {
  openListings: Listing[]
}

export default function ListingsPage(props: ListingsProps) {
  const { profile } = useContext(AuthContext)
  const pageTitle = `${t("pageTitle.rent")} - ${t("nav.siteTitle")}`
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
    <Layout>
      <Head>
        <title>{pageTitle}</title>
      </Head>

      <MetaTags title={t("nav.siteTitle")} image={metaImage} description={metaDescription} />
      <PageHeader title={t("pageTitle.rent")} />
      <ListingsCombined listings={props.openListings} />
    </Layout>
  )
}

export async function getServerSideProps() {
  return {
    props: { openListings: await fetchOpenListings() },
  }
}
