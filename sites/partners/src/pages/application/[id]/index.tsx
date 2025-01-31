import React, { useMemo, useState, useContext } from "react"
import { useRouter } from "next/router"
import Head from "next/head"
import { t, AlertBox, Breadcrumbs, BreadcrumbLink } from "@bloom-housing/ui-components"
import { Tag } from "@bloom-housing/ui-seeds"
import { useSingleApplicationData, useSingleListingData } from "../../../lib/hooks"
import { AuthContext } from "@bloom-housing/shared-helpers"
import Layout from "../../../layouts"
import {
  DetailsMemberDrawer,
  MembersDrawer,
} from "../../../components/applications/PaperApplicationDetails/DetailsMemberDrawer"
import { NavigationHeader } from "../../../components/shared/NavigationHeader"
import { ApplicationContext } from "../../../components/applications/ApplicationContext"
import { DetailsApplicationData } from "../../../components/applications/PaperApplicationDetails/sections/DetailsApplicationData"
import { DetailsPrimaryApplicant } from "../../../components/applications/PaperApplicationDetails/sections/DetailsPrimaryApplicant"
import { DetailsAlternateContact } from "../../../components/applications/PaperApplicationDetails/sections/DetailsAlternateContact"
import { DetailsHouseholdMembers } from "../../../components/applications/PaperApplicationDetails/sections/DetailsHouseholdMembers"
import { DetailsHouseholdDetails } from "../../../components/applications/PaperApplicationDetails/sections/DetailsHouseholdDetails"
import { DetailsMultiselectQuestions } from "../../../components/applications/PaperApplicationDetails/sections/DetailsMultiselectQuestions"
import { DetailsHouseholdIncome } from "../../../components/applications/PaperApplicationDetails/sections/DetailsHouseholdIncome"
import { DetailsTerms } from "../../../components/applications/PaperApplicationDetails/sections/DetailsTerms"
import { Aside } from "../../../components/applications/Aside"
import {
  ApplicationStatusEnum,
  MultiselectQuestionsApplicationSectionEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"

export default function ApplicationsList() {
  const router = useRouter()
  const applicationId = router.query.id as string
  const { application } = useSingleApplicationData(applicationId)

  {
    /* TODO: add listing name in a listing response */
  }
  const { listingDto } = useSingleListingData(application?.listings?.id)

  const { applicationsService } = useContext(AuthContext)
  const [errorAlert, setErrorAlert] = useState(false)

  const [membersDrawer, setMembersDrawer] = useState<MembersDrawer>(null)

  async function deleteApplication() {
    try {
      await applicationsService.delete({ body: { id: applicationId } })
      void router.push(`/listings/${application?.listings?.id}/applications`)
    } catch (err) {
      setErrorAlert(true)
    }
  }

  const applicationStatus = useMemo(() => {
    switch (application?.status) {
      case ApplicationStatusEnum.submitted:
        return (
          <Tag className="tag-uppercase" variant={"success"} size={"lg"}>
            {t(`application.details.applicationStatus.submitted`)}
          </Tag>
        )
      case ApplicationStatusEnum.removed:
        return (
          <Tag className="tag-uppercase" variant={"highlight-warm"} size={"lg"}>
            {t(`application.details.applicationStatus.removed`)}
          </Tag>
        )
      default:
        return (
          <Tag className="tag-uppercase" variant={"primary"} size={"lg"}>
            {t(`application.details.applicationStatus.draft`)}
          </Tag>
        )
    }
  }, [application])

  if (!application) return null

  return (
    <ApplicationContext.Provider value={application}>
      <Layout>
        <Head>
          <title>{t("nav.siteTitlePartners")}</title>
        </Head>
        <NavigationHeader
          className="relative"
          title={
            <>
              <p className="font-sans font-semibold uppercase text-2xl">
                {application.applicant?.firstName} {application.applicant?.lastName}
              </p>

              <p className="font-sans text-base mt-1">
                {application.confirmationCode || application.id}
              </p>
            </>
          }
          breadcrumbs={
            <Breadcrumbs>
              <BreadcrumbLink href="/">{t("t.listing")}</BreadcrumbLink>
              <BreadcrumbLink href={`/listings/${application?.listings?.id}`}>
                {listingDto?.name}
              </BreadcrumbLink>
              <BreadcrumbLink href={`/listings/${application?.listings?.id}/applications`}>
                {t("nav.applications")}
              </BreadcrumbLink>
              <BreadcrumbLink href={`/application/${application.id}`} current>
                {application.confirmationCode}
              </BreadcrumbLink>
            </Breadcrumbs>
          }
        />
        <section className="border-t bg-white">
          <div className="flex flex-row w-full mx-auto max-w-screen-xl justify-end px-5 items-center my-3">
            <div className="status-bar__status md:pl-6 md:w-3/12">{applicationStatus}</div>
          </div>
        </section>

        <section className="bg-primary-lighter">
          <div className="mx-auto px-5 mt-5 max-w-screen-xl">
            {errorAlert && (
              <AlertBox
                className="mb-5"
                onClose={() => setErrorAlert(false)}
                closeable
                type="alert"
              >
                {t("authentication.signIn.errorGenericMessage")}
              </AlertBox>
            )}

            <div className="flex flex-row flex-wrap ">
              <div className="info-card md:w-9/12">
                <DetailsApplicationData />

                <DetailsPrimaryApplicant />

                <DetailsAlternateContact />

                <DetailsHouseholdMembers setMembersDrawer={setMembersDrawer} />

                <DetailsHouseholdDetails />

                <DetailsMultiselectQuestions
                  listingId={application?.listings?.id}
                  applicationSection={MultiselectQuestionsApplicationSectionEnum.programs}
                  title={t("application.details.programs")}
                />

                <DetailsHouseholdIncome />

                <DetailsMultiselectQuestions
                  listingId={application?.listings?.id}
                  applicationSection={MultiselectQuestionsApplicationSectionEnum.preferences}
                  title={t("application.details.preferences")}
                />

                <DetailsTerms />
              </div>

              <div className="md:w-3/12 pl-6">
                <Aside
                  type="details"
                  listingId={application?.listings?.id}
                  onDelete={deleteApplication}
                />
              </div>
            </div>
          </div>
        </section>
      </Layout>

      <DetailsMemberDrawer
        application={application}
        membersDrawer={membersDrawer}
        setMembersDrawer={setMembersDrawer}
      />
    </ApplicationContext.Provider>
  )
}
