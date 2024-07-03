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
import { Button, Heading, Link } from "@bloom-housing/ui-seeds"
import FormsLayout from "../../../layouts/forms"
import { AppSubmissionContext } from "../../../lib/applications/AppSubmissionContext"
import { UserStatus } from "../../../lib/constants"
import { ReviewOrderTypeEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

const ApplicationConfirmation = () => {
  const { application, listing } = useContext(AppSubmissionContext)
  const { initialStateLoaded, profile } = useContext(AuthContext)
  const router = useRouter()

  const imageUrl = imageUrlFromListing(listing, parseInt(process.env.listingPhotoSize))?.[0]

  const content = useMemo(() => {
    switch (listing?.reviewOrderType) {
      case ReviewOrderTypeEnum.firstComeFirstServe:
        return {
          text: t("application.review.confirmation.whatHappensNext.fcfs"),
        }
      case ReviewOrderTypeEnum.lottery:
        return {
          text: t("application.review.confirmation.whatHappensNext.lottery"),
        }
      case ReviewOrderTypeEnum.waitlist:
        return {
          text: t("application.review.confirmation.whatHappensNext.waitlist"),
        }
      default:
        return { text: "" }
    }
  }, [listing, router.locale])

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Application - Confirmation",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  return (
    <FormsLayout>
      <BloomCard>
        <>
          <CardSection divider={"flush"}>
            <Heading priority={1} size={"2xl"}>
              {t("application.review.confirmation.title")}
              {listing?.name}
            </Heading>
          </CardSection>

          {imageUrl && <img src={imageUrl} alt={listing?.name} />}

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
            <CardSection className={"bg-primary-lighter border-none"} divider={"flush"}>
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
