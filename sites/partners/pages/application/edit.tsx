import React from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import {
  AppearanceStyleType,
  Button,
  MetaTags,
  PageHeader,
  StatusBar,
  t,
} from "@bloom-housing/ui-components"
import { ApplicationStatus } from "@bloom-housing/backend-core/types"
import Layout from "../../layouts/application"
import PaperApplicationForm from "../../src/applications/PaperApplicationForm/PaperApplicationForm"
import { useSingleApplicationData } from "../../lib/hooks"

const NewApplication = () => {
  const metaDescription = ""
  const metaImage = "" // TODO: replace with hero image

  const router = useRouter()
  const applicationId = router.query.id as string

  const { application } = useSingleApplicationData(applicationId)

  if (!application) return false

  return (
    <Layout>
      <Head>
        <title>{t("nav.siteTitle")}</title>
      </Head>
      <MetaTags title={t("nav.siteTitle")} image={metaImage} description={metaDescription} />
      <PageHeader>
        {t("applications.editApplication")}{" "}
        <p className="text-base">{`${application.applicant?.firstName} ${application.applicant?.middleName} ${application.applicant?.lastName}`}</p>
      </PageHeader>

      <StatusBar
        backButton={
          <Button inlineIcon="left" icon="arrow-back" onClick={() => router.back()}>
            {t("t.back")}
          </Button>
        }
        tagStyle={
          application?.status == ApplicationStatus.submitted
            ? AppearanceStyleType.success
            : AppearanceStyleType.primary
        }
        tagLabel={
          application?.status
            ? t(`application.details.applicationStatus.${application.status}`)
            : t(`application.details.applicationStatus.submitted`)
        }
      />
      <PaperApplicationForm listingId={application.listing.id} application={application} editMode />
    </Layout>
  )
}

export default NewApplication
