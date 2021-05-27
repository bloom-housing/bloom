import React, { useMemo, useState, useContext } from "react"
import { useRouter } from "next/router"
import Head from "next/head"
import {
  AppearanceStyleType,
  PageHeader,
  t,
  Tag,
  Button,
  ApiClientContext,
  AlertBox,
  SiteAlert,
} from "@bloom-housing/ui-components"
import { useSingleApplicationData } from "../../../lib/hooks"

import Layout from "../../../layouts"
import { ApplicationStatus } from "@bloom-housing/backend-core/types"
import {
  DetailsMemberDrawer,
  MembersDrawer,
} from "../../../src/applications/PaperApplicationDetails/DetailsMemberDrawer"

import { ApplicationContext } from "../../../src/applications/ApplicationContext"
import { DetailsApplicationData } from "../../../src/applications/PaperApplicationDetails/sections/DetailsApplicationData"
import { DetailsPrimaryApplicant } from "../../../src/applications/PaperApplicationDetails/sections/DetailsPrimaryApplicant"
import { DetailsAlternateContact } from "../../../src/applications/PaperApplicationDetails/sections/DetailsAlternateContact"
import { DetailsHouseholdMembers } from "../../../src/applications/PaperApplicationDetails/sections/DetailsHouseholdMembers"
import { DetailsHouseholdDetails } from "../../../src/applications/PaperApplicationDetails/sections/DetailsHouseholdDetails"
import { DetailsPreferences } from "../../../src/applications/PaperApplicationDetails/sections/DetailsPreferences"
import { DetailsHouseholdIncome } from "../../../src/applications/PaperApplicationDetails/sections/DetailsHouseholdIncome"
import { DetailsTerms } from "../../../src/applications/PaperApplicationDetails/sections/DetailsTerms"
import { Aside } from "../../../src/applications/Aside"

export default function ApplicationsList() {
  const router = useRouter()
  const applicationId = router.query.id as string
  const { application } = useSingleApplicationData(applicationId)

  const { applicationsService } = useContext(ApiClientContext)
  const [errorAlert, setErrorAlert] = useState(false)

  const [membersDrawer, setMembersDrawer] = useState<MembersDrawer>(null)

  async function deleteApplication() {
    try {
      await applicationsService.delete({ applicationId })
      void router.push(`/listings/${application?.listing?.id}/applications`)
    } catch (err) {
      setErrorAlert(true)
    }
  }

  const applicationStatus = useMemo(() => {
    switch (application?.status) {
      case ApplicationStatus.submitted:
        return (
          <Tag styleType={AppearanceStyleType.success} pillStyle>
            {t(`application.details.applicationStatus.submitted`)}
          </Tag>
        )
      case ApplicationStatus.removed:
        return (
          <Tag styleType={AppearanceStyleType.warning} pillStyle>
            {t(`application.details.applicationStatus.removed`)}
          </Tag>
        )
      default:
        return (
          <Tag styleType={AppearanceStyleType.primary} pillStyle>
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
          <title>{t("nav.siteTitle")}</title>
        </Head>

        <PageHeader
          className="relative"
          title={
            <>
              <p className="font-sans font-semibold uppercase text-3xl">
                {application.applicant.firstName} {application.applicant.lastName}
              </p>

              <p className="font-sans text-base mt-1">{application.id}</p>
            </>
          }
        >
          <div className="flex top-4 right-4 absolute z-50 flex-col items-center">
            <SiteAlert type="success" timeout={5000} dismissable />
          </div>
        </PageHeader>
        <section className="border-t bg-white">
          <div className="flex flex-row w-full mx-auto max-w-screen-xl justify-between px-5 items-center my-3">
            <Button
              inlineIcon="left"
              icon="arrowBack"
              onClick={() => router.push(`/listings/${application.listing.id}/applications`)}
            >
              {t("t.back")}
            </Button>

            <div className="status-bar__status md:pl-4 md:w-3/12">{applicationStatus}</div>
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

                <DetailsPreferences listingId={application?.listing?.id} />

                <DetailsHouseholdIncome />

                <DetailsTerms />
              </div>

              <div className="md:w-3/12 pl-6">
                <Aside
                  type="details"
                  listingId={application?.listing?.id}
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
