/*
 0.1 - Choose Language
 Applicants are given the option to start the Application in one of a number of languages via button group. Once inside the application the applicant can use the language selection at the top of the page.
 https://github.com/bloom-housing/bloom/issues/277
 */
import axios from "axios"
import { useRouter } from "next/router"
import { Button } from "@bloom-housing/ui-seeds"
import {
  ImageCard,
  ActionBlock,
  t,
  Heading,
  setSiteAlertMessage,
} from "@bloom-housing/ui-components"
import {
  imageUrlFromListing,
  OnClientSide,
  PageView,
  pushGtmEvent,
  AuthContext,
} from "@bloom-housing/shared-helpers"

import FormsLayout from "../../../layouts/forms"
import {
  AppSubmissionContext,
  retrieveApplicationConfig,
} from "../../../lib/applications/AppSubmissionContext"
import React, { useCallback, useContext, useEffect, useState } from "react"
import { Language } from "@bloom-housing/backend-core/types"
import { useGetApplicationStatusProps } from "../../../lib/hooks"
import { UserStatus } from "../../../lib/constants"
import { CardSection } from "@bloom-housing/ui-seeds/src/blocks/Card"
import ApplicationFormLayout from "../../../layouts/application-form"

const loadListing = async (listingId, stateFunction, conductor, context, language) => {
  const response = await axios.get(`${process.env.backendApiBase}/listings/${listingId}`, {
    headers: { language },
  })
  conductor.listing = response.data
  const applicationConfig = retrieveApplicationConfig(conductor.listing) // TODO: load from backend
  conductor.config = applicationConfig
  stateFunction(conductor.listing)
  context.syncListing(conductor.listing)
}

const ApplicationChooseLanguage = () => {
  const router = useRouter()
  const [listing, setListing] = useState(null)
  const context = useContext(AppSubmissionContext)
  const { initialStateLoaded, profile } = useContext(AuthContext)
  const { conductor } = context

  const listingId = router.query.listingId

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Application - Choose Language",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  useEffect(() => {
    conductor.reset()
    if (!router.isReady && !listingId) return
    if (router.isReady && !listingId) {
      void router.push("/")
      return
    }

    if (!context.listing || context.listing.id !== listingId) {
      void loadListing(listingId, setListing, conductor, context, "en")
    } else {
      conductor.listing = context.listing
      setListing(context.listing)
    }
  }, [router, conductor, context, listingId])

  useEffect(() => {
    if (listing?.status === "closed") {
      setSiteAlertMessage(t("listings.applicationsClosedRedirect"), "alert")
      void router.push(`/${router.locale}/listing/${listing?.id}/${listing.urlSlug}`)
    }
  }, [listing, router])

  const imageUrl = listing?.assets
    ? imageUrlFromListing(listing, parseInt(process.env.listingPhotoSize))[0]
    : ""

  const onLanguageSelect = useCallback(
    (language: Language) => {
      conductor.currentStep.save({
        language,
      })
      void loadListing(listingId, setListing, conductor, context, language).then(() => {
        void router.push(conductor.determineNextUrl(), null, { locale: language })
      })
    },
    [conductor, context, listingId, router]
  )

  const { content: appStatusContent } = useGetApplicationStatusProps(listing)

  return (
    <FormsLayout>
      <ApplicationFormLayout
        listingName={listing?.name}
        heading={t("application.chooseLanguage.letsGetStarted")}
        progressNavProps={{
          currentPageSection: 1,
          completedSections: 0,
          labels: conductor.config.sections.map((label) => t(`t.${label}`)),
          mounted: OnClientSide(),
        }}
      >
        {listing && (
          <CardSection className={"p-0"}>
            <ImageCard
              imageUrl={imageUrl}
              statuses={[{ content: appStatusContent }]}
              description={listing.name}
            />
          </CardSection>
        )}

        {listing?.applicationConfig.languages.length > 1 && (
          <CardSection divider={"flush"}>
            <>
              <div>
                <Heading styleType="underlineWeighted">
                  {t("application.chooseLanguage.chooseYourLanguage")}
                </Heading>
              </div>
              {listing.applicationConfig.languages.map((lang, index) => (
                <Button
                  className="mx-1 mb-2"
                  onClick={() => {
                    onLanguageSelect(lang)
                  }}
                  key={index}
                  data-testid={"app-choose-language-button"}
                >
                  {t(`applications.begin.${lang}`)}
                </Button>
              ))}
            </>
          </CardSection>
        )}

        {initialStateLoaded && !profile && (
          <>
            <CardSection divider={"flush"} className={"bg-primary-lighter"}>
              <ActionBlock
                header={<Heading priority={2}>{t("account.haveAnAccount")}</Heading>}
                subheader={t("application.chooseLanguage.signInSaveTime")}
                className={"p-0"}
                actions={[
                  <Button
                    variant="primary-outlined"
                    href={`/sign-in?redirectUrl=/applications/start/choose-language&listingId=${listingId?.toString()}`}
                    id={"app-choose-language-sign-in-button"}
                    size="sm"
                  >
                    {t("nav.signIn")}
                  </Button>,
                ]}
              />
            </CardSection>
            <CardSection divider={"flush"} className={"bg-primary-lighter"}>
              <ActionBlock
                header={
                  <Heading priority={2}>{t("authentication.createAccount.noAccount")}</Heading>
                }
                className={"p-0"}
                actions={[
                  <Button
                    variant="primary-outlined"
                    href={"/create-account"}
                    id={"app-choose-language-create-account-button"}
                    size="sm"
                  >
                    {t("account.createAccount")}
                  </Button>,
                ]}
              />
            </CardSection>
          </>
        )}
      </ApplicationFormLayout>
    </FormsLayout>
  )
}

export default ApplicationChooseLanguage
