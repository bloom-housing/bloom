import React from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import { NavigationHeader, t, Breadcrumbs, BreadcrumbLink } from "@bloom-housing/ui-components"
import Layout from "../../../layouts"
import PaperApplicationForm from "../../../src/applications/PaperApplicationForm/PaperApplicationForm"
import { useSingleApplicationData, useSingleListingData } from "../../../lib/hooks"
import { ApplicationContext } from "../../../src/applications/ApplicationContext"

const NewApplication = () => {
  const router = useRouter()
  const applicationId = router.query.id as string

  const { application } = useSingleApplicationData(applicationId)

  {
    /* TODO: add listing name in a listing response */
  }
  const { listingDto } = useSingleListingData(application?.listing.id)

  if (!application) return false

  return (
    <ApplicationContext.Provider value={application}>
      <Layout>
        <Head>
          <title>{t("nav.siteTitlePartners")}</title>
        </Head>

        <NavigationHeader
          title={
            <>
              <p className="font-sans font-semibold uppercase text-3xl">
                {t("t.edit")}: {application.applicant.firstName} {application.applicant.lastName}
              </p>

              <p className="font-sans text-base mt-1">
                {application.confirmationCode || application.id}
              </p>
            </>
          }
          breadcrumbs={
            <Breadcrumbs>
              <BreadcrumbLink href="/">{t("t.listing")}</BreadcrumbLink>
              <BreadcrumbLink href={`/listings/${application?.listing?.id}`}>
                {listingDto?.name}
              </BreadcrumbLink>
              <BreadcrumbLink href={`/listings/${application?.listing?.id}/applications`}>
                {t("nav.applications")}
              </BreadcrumbLink>
              <BreadcrumbLink href={`/application/${application.id}`}>
                {application.confirmationCode}
              </BreadcrumbLink>
              <BreadcrumbLink href={`/application/${application.id}/edit`} current>
                {t("t.edit")}
              </BreadcrumbLink>
            </Breadcrumbs>
          }
        />

        <PaperApplicationForm
          listingId={application.listing.id}
          application={application}
          editMode
        />
      </Layout>
    </ApplicationContext.Provider>
  )
}

export default NewApplication
