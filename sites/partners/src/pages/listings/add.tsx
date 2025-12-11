import React, { useEffect } from "react"
import Head from "next/head"
import { t, Breadcrumbs, BreadcrumbLink } from "@bloom-housing/ui-components"
import Layout from "../../layouts"
import PaperListingForm from "../../components/listings/PaperListingForm"
import { MetaTags } from "../../components/shared/MetaTags"
import { NavigationHeader } from "../../components/shared/NavigationHeader"
import ListingGuard from "../../components/shared/ListingGuard"
import { useRouter } from "next/router"

const NewListing = () => {
  const metaDescription = ""
  const metaImage = "" // TODO: replace with hero image

  const router = useRouter()
  const selectedJurisdiction = router.query.jurisdictionId as string
  const isNonRegulated = !!router.query.nonRegulated

  useEffect(() => {
    if (!selectedJurisdiction) {
      void router.replace("/")
    }
  }, [router, selectedJurisdiction])

  return (
    <ListingGuard>
      <Layout>
        <Head>
          <title>{`Add listing - ${t("nav.siteTitlePartners")}`}</title>
        </Head>
        <MetaTags
          title={t("nav.siteTitlePartners")}
          image={metaImage}
          description={metaDescription}
        />
        <NavigationHeader
          className="relative"
          title={t("listings.newListing")}
          breadcrumbs={
            <Breadcrumbs>
              <BreadcrumbLink href="/">{t("t.listing")}</BreadcrumbLink>
              <BreadcrumbLink href="/listings/add" current>
                {t("listings.newListing")}
              </BreadcrumbLink>
            </Breadcrumbs>
          }
        />
        <PaperListingForm jurisdictionId={selectedJurisdiction} isNonRegulated={isNonRegulated} />
      </Layout>
    </ListingGuard>
  )
}

export default NewListing
