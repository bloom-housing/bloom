import React, { useCallback, useContext, useEffect, useState } from "react"
import { useRouter } from "next/router"
import dayjs from "dayjs"
import { ImageCard, t } from "@bloom-housing/ui-components"
import {
  imageUrlFromListing,
  OnClientSide,
  PageView,
  pushGtmEvent,
  AuthContext,
  useToastyRef,
  CustomIconMap,
} from "@bloom-housing/shared-helpers"
import {
  LanguagesEnum,
  ListingsStatusEnum,
  ListingsService,
  JurisdictionsService,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { Heading, Icon, Button, Message } from "@bloom-housing/ui-seeds"
import { CardSection } from "@bloom-housing/ui-seeds/src/blocks/Card"
import FormsLayout from "../../../layouts/forms"
import {
  AppSubmissionContext,
  retrieveApplicationConfig,
} from "../../../lib/applications/AppSubmissionContext"
import { UserStatus } from "../../../lib/constants"
import ApplicationFormLayout from "../../../layouts/application-form"
import { getListingApplicationStatus } from "../../../lib/helpers"
import styles from "../../../layouts/application-form.module.scss"

const loadListing = async (
  listingId,
  stateFunction,
  conductor,
  context,
  language,
  listingsService: ListingsService,
  jurisdictionsService: JurisdictionsService,
  isPreview
) => {
  const listingResponse = await listingsService.retrieve(
    { id: listingId },
    {
      headers: { language },
    }
  )

  const jurisdictionResponse = await jurisdictionsService.retrieve({
    jurisdictionId: listingResponse.jurisdictions.id,
  })
  conductor.listing = listingResponse
  const applicationConfig = retrieveApplicationConfig(conductor.listing, isPreview) // TODO: load from backend
  conductor.config = {
    ...applicationConfig,
    languages: jurisdictionResponse.languages,
    featureFlags: jurisdictionResponse.featureFlags,
  }
  stateFunction(conductor.listing)
  context.syncListing(conductor.listing)
}

const ApplicationChooseLanguage = () => {
  const router = useRouter()
  const [listing, setListing] = useState(null)
  const context = useContext(AppSubmissionContext)
  const { initialStateLoaded, profile, listingsService, jurisdictionsService } =
    useContext(AuthContext)
  const toastyRef = useToastyRef()
  const { conductor } = context

  const listingId = router.query.listingId
  const isPreview = router.query.preview === "true"

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
    if (router.isReady) {
      if (
        !listingId ||
        (process.env.showMandatedAccounts && initialStateLoaded && !profile && !isPreview)
      ) {
        void router.push("/")
      }
    }
    if (!context.listing || context.listing.id !== listingId) {
      void loadListing(
        listingId,
        setListing,
        conductor,
        context,
        "en",
        listingsService,
        jurisdictionsService,
        isPreview
      )
    } else {
      conductor.listing = context.listing
      setListing(context.listing)
    }
  }, [
    router,
    conductor,
    context,
    listingId,
    initialStateLoaded,
    profile,
    listingsService,
    jurisdictionsService,
    isPreview,
  ])

  useEffect(() => {
    const { addToast } = toastyRef.current

    if (listing && router.isReady) {
      const currentDate = dayjs()
      if (
        !(listing.digitalApplication && listing.commonDigitalApplication) ||
        (!isPreview && listing?.status !== ListingsStatusEnum.active) ||
        (listing?.applicationDueDate && currentDate > dayjs(listing.applicationDueDate))
      ) {
        addToast(t("listings.applicationsClosedRedirect"), { variant: "alert" })
        void router.push(`/${router.locale}/listing/${listing?.id}/${listing?.urlSlug}`)
      }
    }
  }, [isPreview, listing, router, toastyRef])

  const imageUrl = listing?.assets
    ? imageUrlFromListing(listing, parseInt(process.env.listingPhotoSize))[0]
    : ""

  const onLanguageSelect = useCallback(
    (language: LanguagesEnum) => {
      conductor.currentStep.save({
        language,
      })
      void loadListing(
        listingId,
        setListing,
        conductor,
        context,
        language,
        listingsService,
        jurisdictionsService,
        isPreview
      ).then(() => {
        void router.push(conductor.determineNextUrl(), null, { locale: language })
      })
    },
    [conductor, context, listingId, router, listingsService, jurisdictionsService, isPreview]
  )

  const statusContent = getListingApplicationStatus(listing)

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
        hideBorder={true}
      >
        {listing && (
          <CardSection className={"p-0"}>
            <ImageCard imageUrl={imageUrl} description={listing.name} />
            <Message
              className={styles["message-inside-card"]}
              customIcon={
                <Icon size="md" outlined>
                  {CustomIconMap.clock}
                </Icon>
              }
              fullwidth
            >
              {statusContent?.content}
            </Message>
          </CardSection>
        )}

        {listing?.applicationConfig.languages.length > 1 && (
          <CardSection divider={"flush"}>
            <>
              <Heading priority={2} size={"lg"} className={"mb-10"}>
                <span className={styles["underlined-text-heading"]}>
                  {t("application.chooseLanguage.chooseYourLanguage")}
                </span>
              </Heading>
              {listing.applicationConfig.languages.map((lang, index) => (
                <Button
                  variant="primary-outlined"
                  className="mr-2 mb-2"
                  onClick={() => {
                    onLanguageSelect(lang)
                  }}
                  key={index}
                  id={"app-choose-language-button"}
                >
                  {t(`languages.${lang}`)}
                </Button>
              ))}
            </>
          </CardSection>
        )}

        {initialStateLoaded && !profile && (
          <>
            <CardSection divider={"flush"} className={styles["application-form-action-footer"]}>
              <Heading priority={2} size={"2xl"} className={"pb-4"}>
                {t("account.haveAnAccount")}
              </Heading>
              <p className={"pb-4"}>{t("application.chooseLanguage.signInSaveTime")}</p>
              <Button
                variant="primary-outlined"
                href={`/sign-in?redirectUrl=/applications/start/choose-language&listingId=${listingId?.toString()}`}
                id={"app-choose-language-sign-in-button"}
                size="sm"
              >
                {t("nav.signIn")}
              </Button>
            </CardSection>
            <CardSection divider={"flush"} className={styles["application-form-action-footer"]}>
              <Heading priority={2} size={"2xl"} className={"pb-4"}>
                {t("authentication.createAccount.noAccount")}
              </Heading>
              <Button
                variant="primary-outlined"
                href={"/create-account"}
                id={"app-choose-language-create-account-button"}
                size="sm"
              >
                {t("account.createAccount")}
              </Button>
            </CardSection>
          </>
        )}
      </ApplicationFormLayout>
    </FormsLayout>
  )
}

export default ApplicationChooseLanguage
