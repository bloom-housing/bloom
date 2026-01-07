import React, { useState, useContext } from "react"
import { useRouter } from "next/router"
import Head from "next/head"
import { t, AlertBox, Breadcrumbs, BreadcrumbLink } from "@bloom-housing/ui-components"
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
  FeatureFlagEnum,
  MultiselectQuestionsApplicationSectionEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { StatusBar } from "../../../components/shared/StatusBar"
import { ApplicationStatusTag } from "../../../components/listings/PaperListingDetails/sections/helpers"

const ApplicationsList = () => {
  const router = useRouter()
  const applicationId = router.query.id as string
  const { application } = useSingleApplicationData(applicationId)
  const { listingDto } = useSingleListingData(application?.listings?.id)

  const { applicationsService, doJurisdictionsHaveFeatureFlagOn } = useContext(AuthContext)

  const enableAdaOtherOption = doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.enableAdaOtherOption,
    listingDto?.jurisdictions.id
  )

  const disableWorkInRegion = doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.disableWorkInRegion,
    listingDto?.jurisdictions.id
  )

  const enableFullTimeStudentQuestion = doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.enableFullTimeStudentQuestion,
    listingDto?.jurisdictions.id
  )

  const enableApplicationStatus = doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.enableApplicationStatus,
    listingDto?.jurisdictions.id
  )

  const swapCommunityTypeWithPrograms = doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.swapCommunityTypeWithPrograms,
    listingDto?.jurisdictions.id
  )

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

  if (!application) return null

  return (
    <ApplicationContext.Provider value={application}>
      <Layout>
        <Head>
          <title>{`Application - ${t("nav.siteTitlePartners")}`}</title>
        </Head>
        <NavigationHeader
          className="relative"
          title={
            <>
              <p className="font-sans font-semibold uppercase text-2xl">
                {application.applicant.firstName} {application.applicant.lastName}
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
        <StatusBar>
          <ApplicationStatusTag status={application?.status} />
        </StatusBar>

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
                <DetailsApplicationData enableApplicationStatus={enableApplicationStatus} />

                <DetailsPrimaryApplicant
                  enableFullTimeStudentQuestion={enableFullTimeStudentQuestion}
                  disableWorkInRegion={disableWorkInRegion}
                />

                <DetailsAlternateContact />

                <DetailsHouseholdMembers
                  setMembersDrawer={setMembersDrawer}
                  enableFullTimeStudentQuestion={enableFullTimeStudentQuestion}
                  disableWorkInRegion={disableWorkInRegion}
                />

                <DetailsHouseholdDetails
                  enableFullTimeStudentQuestion={enableFullTimeStudentQuestion}
                  enableAdaOtherOption={enableAdaOtherOption}
                />

                <DetailsMultiselectQuestions
                  listingId={application?.listings?.id}
                  applicationSection={MultiselectQuestionsApplicationSectionEnum.programs}
                  title={
                    swapCommunityTypeWithPrograms
                      ? t("application.details.communityTypes")
                      : t("application.details.programs")
                  }
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
        enableFullTimeStudentQuestion={enableFullTimeStudentQuestion}
        disableWorkInRegion={disableWorkInRegion}
      />
    </ApplicationContext.Provider>
  )
}

export default ApplicationsList
