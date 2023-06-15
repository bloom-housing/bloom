import React from "react"
import Head from "next/head"
import { t, Breadcrumbs, BreadcrumbLink } from "@bloom-housing/ui-components"
import { SiteAlert } from "@bloom-housing/shared-helpers"
import Layout from "../../../../layouts"
import PaperApplicationForm from "../../../../components/applications/PaperApplicationForm/PaperApplicationForm"
import { NavigationHeader } from "../../../../components/shared/NavigationHeader"
import { useRouter } from "next/router"
import { useSingleListingData } from "../../../../lib/hooks"

const NewApplication = () => {
  const router = useRouter()
  const listingId = router.query.id as string

  const { listingDto: listing } = useSingleListingData(listingId)

  return (
    <Layout>
      <Head>
        <title>{t("nav.siteTitlePartners")}</title>
      </Head>
      <SiteAlert type="success" timeout={5000} dismissable sticky={true} />
      <NavigationHeader
        className="relative"
        title={t("applications.newApplication")}
        breadcrumbs={
          <Breadcrumbs>
            <BreadcrumbLink href="/">{t("t.listing")}</BreadcrumbLink>
            <BreadcrumbLink href={`/listings/${listingId}`}>{listing?.name}</BreadcrumbLink>
            <BreadcrumbLink href={`/listings/${listingId}/applications`}>
              {t("nav.applications")}
            </BreadcrumbLink>
            <BreadcrumbLink href={`/listings/${listingId}/applications/add`} current>
              {t("t.add")}
            </BreadcrumbLink>
          </Breadcrumbs>
        }
      />

      <PaperApplicationForm listingId={listingId} />
    </Layout>
  )
}

export default NewApplication
