import React, { useContext, useEffect, useMemo } from "react"
import { useRouter } from "next/router"
import Markdown from "markdown-to-jsx"
import { t, ApplicationTimeline } from "@bloom-housing/ui-components"
import { CardSection } from "@bloom-housing/ui-seeds/src/blocks/Card"
import {
  imageUrlFromListing,
  PageView,
  pushGtmEvent,
  AuthContext,
  BloomCard,
} from "@bloom-housing/shared-helpers"
import {
  FeatureFlagEnum,
  ReviewOrderTypeEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { Button, Heading, Link } from "@bloom-housing/ui-seeds"
import FormsLayout from "../../../layouts/forms"
import styles from "../../../layouts/application-form.module.scss"
import { AppSubmissionContext } from "../../../lib/applications/AppSubmissionContext"
import { UserStatus } from "../../../lib/constants"
import { isFeatureFlagOn, isUnitGroupAppBase, isUnitGroupAppWaitlist } from "../../../lib/helpers"

const ApplicationConfirmation = () => {
  const { application, listing, conductor } = useContext(AppSubmissionContext)
  const { initialStateLoaded, profile } = useContext(AuthContext)
  const router = useRouter()

  const disableListingPreferences = isFeatureFlagOn(
    conductor.config,
    FeatureFlagEnum.disableListingPreferences
  )

  const imageUrl = imageUrlFromListing(listing, parseInt(process.env.listingPhotoSize))[0]

  const content = useMemo(() => {
    switch (listing?.reviewOrderType) {
      case ReviewOrderTypeEnum.firstComeFirstServe:
        if (isUnitGroupAppWaitlist(listing, conductor.config)) {
          return {
            text: t(
              `application.review.confirmation.whatHappensNext${
                disableListingPreferences ? ".noPref" : ""
              }.waitlist`
            ),
          }
        }
        if (isUnitGroupAppBase(listing, conductor.config)) {
          return {
            text: t(
              `application.review.confirmation.whatHappensNext${
                disableListingPreferences ? ".noPref" : ""
              }.base`
            ),
          }
        }
        return {
          text: t(
            `application.review.confirmation.whatHappensNext${
              disableListingPreferences ? ".noPref" : ""
            }.fcfs`
          ),
        }
      case ReviewOrderTypeEnum.lottery:
      case ReviewOrderTypeEnum.waitlist:
      case ReviewOrderTypeEnum.waitlistLottery:
        return {
          text: t(
            `application.review.confirmation.whatHappensNext${
              disableListingPreferences ? ".noPref" : ""
            }.${listing.reviewOrderType}`
          ),
        }
      default:
        return { text: "" }
    }
  }, [listing, conductor.config])

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Application - Confirmation",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  return (
    <FormsLayout
      pageTitle={`${t("account.application.confirmation")} - ${t("listings.apply.applyOnline")} - ${
        listing?.name
      }`}
    >
      <BloomCard>
        <>
          <CardSection divider={"flush"}>
            <Heading priority={1} size={"2xl"}>
              {t("application.review.confirmation.title")}
              {listing?.name}
            </Heading>
          </CardSection>

          <div className={styles["application-form-image-card-section"]}>
            <div className={styles["image-container"]}>
              {imageUrl && <img src={imageUrl} alt={listing?.name} />}
            </div>
          </div>

          <CardSection divider={"inset"}>
            <Heading priority={2} size="lg">
              {t("application.review.confirmation.lotteryNumber")}
            </Heading>

            <p
              id="confirmationCode"
              className="font-serif text-2xl my-3"
              data-testid={"app-confirmation-id"}
            >
              {application.confirmationCode || application.id}
            </p>
            <p>{t("application.review.confirmation.pleaseWriteNumber")}</p>
          </CardSection>

          <CardSection divider={"inset"}>
            <div className="markdown markdown-informational">
              <ApplicationTimeline />

              <Markdown options={{ disableParsingRawHTML: true }}>{content.text}</Markdown>
            </div>
          </CardSection>

          <CardSection divider={"inset"}>
            <div className="markdown markdown-informational">
              <Markdown options={{ disableParsingRawHTML: true }}>
                {t("application.review.confirmation.needToMakeUpdates", {
                  agentName: listing?.leasingAgentName || "",
                  agentPhone: listing?.leasingAgentPhone || "",
                  agentEmail: listing?.leasingAgentEmail || "",
                  agentOfficeHours: listing?.leasingAgentOfficeHours || "",
                })}
              </Markdown>
            </div>
          </CardSection>

          {initialStateLoaded && !profile && (
            <CardSection divider={"flush"} className={"border-none"}>
              <div className="markdown markdown-informational">
                <Markdown options={{ disableParsingRawHTML: true }}>
                  {t("application.review.confirmation.createAccount")}
                </Markdown>
              </div>
            </CardSection>
          )}

          {initialStateLoaded && !profile && (
            <CardSection
              className={`${styles["application-form-action-footer"]} border-none`}
              divider={"flush"}
            >
              <Button
                variant={"primary"}
                onClick={() => {
                  void router.push("/create-account")
                }}
                id={"app-confirmation-create-account"}
              >
                {t("account.createAccount")}
              </Button>
            </CardSection>
          )}

          <CardSection divider={"flush"}>
            <Link href="/listings">{t("application.review.confirmation.browseMore")}</Link>
          </CardSection>

          <CardSection>
            <Link href="/applications/view">{t("application.review.confirmation.print")}</Link>
          </CardSection>
        </>
      </BloomCard>
    </FormsLayout>
  )
}

export default ApplicationConfirmation
