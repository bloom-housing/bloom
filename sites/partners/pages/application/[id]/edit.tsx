import React from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import { PageHeader, t } from "@bloom-housing/ui-components"
import Layout from "../../../layouts"
import PaperApplicationForm from "../../../src/applications/PaperApplicationForm/PaperApplicationForm"
import { useSingleApplicationData } from "../../../lib/hooks"
import { ApplicationContext } from "../../../src/applications/ApplicationContext"

const NewApplication = () => {
  const router = useRouter()
  const applicationId = router.query.id as string

  const { application } = useSingleApplicationData(applicationId)

  if (!application) return false

  return (
    <ApplicationContext.Provider value={application}>
      <Layout>
        <Head>
          <title>{t("nav.siteTitle")}</title>
        </Head>

        <PageHeader
          title={
            <>
              <p className="font-sans font-semibold uppercase text-3xl">
                {t("t.edit")}: {application.applicant.firstName} {application.applicant.lastName}
              </p>

              <p className="font-sans text-base mt-1">{application.id}</p>
            </>
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
