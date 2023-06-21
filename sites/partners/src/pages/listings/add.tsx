import React from "react"
import Head from "next/head"
import { t, Breadcrumbs, BreadcrumbLink } from "@bloom-housing/ui-components"
import Layout from "../../layouts"
import PaperListingForm from "../../components/listings/PaperListingForm"
import { MetaTags } from "../../components/shared/MetaTags"
import { NavigationHeader } from "../../components/shared/NavigationHeader"
import ListingGuard from "../../components/shared/ListingGuard"
import { getSiteMessage } from "@bloom-housing/shared-helpers"
import { Toast } from "@bloom-housing/ui-seeds"

const NewListing = () => {
  const metaDescription = ""
  const metaImage = "" // TODO: replace with hero image
  const successToastMessage = getSiteMessage("success")

  return (
    <ListingGuard>
      <Layout>
        <Head>
          <title>{t("nav.siteTitlePartners")}</title>
        </Head>
        <MetaTags
          title={t("nav.siteTitlePartners")}
          image={metaImage}
          description={metaDescription}
        />
        {successToastMessage && (
          <Toast variant="success" hideTimeout={5000}>
            {successToastMessage}
          </Toast>
        )}
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
        <PaperListingForm />
      </Layout>
    </ListingGuard>
  )
}

export default NewListing
