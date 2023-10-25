import React, { useContext, useEffect, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import Markdown from "markdown-to-jsx"
import { AppearanceStyleType, Button, t, ApplicationTimeline } from "@bloom-housing/ui-components"
import { CardSection } from "@bloom-housing/ui-seeds/src/blocks/Card"
import { ListingReviewOrder } from "@bloom-housing/backend-core/types"
import {
  imageUrlFromListing,
  PageView,
  pushGtmEvent,
  AuthContext,
} from "@bloom-housing/shared-helpers"
import { Card, Heading } from "@bloom-housing/ui-seeds"
import FormsLayout from "../../../layouts/forms"
import { AppSubmissionContext } from "../../../lib/applications/AppSubmissionContext"
import { UserStatus } from "../../../lib/constants"

const ApplicationConfirmation = () => {
  const { application, listing } = useContext(AppSubmissionContext)
  const { initialStateLoaded, profile } = useContext(AuthContext)
  const router = useRouter()

  const imageUrl = imageUrlFromListing(listing, parseInt(process.env.listingPhotoSize))[0]

  const content = useMemo(() => {
    switch (listing?.reviewOrderType) {
      case ListingReviewOrder.firstComeFirstServe:
        return {
          text: t("application.review.confirmation.whatHappensNext.fcfs"),
        }
      case ListingReviewOrder.lottery:
        return {
          text: t("application.review.confirmation.whatHappensNext.lottery"),
        }
      case ListingReviewOrder.waitlist:
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
      <Card spacing={"lg"}>
        <CardSection divider={"flush"}>
          <Heading priority={1} size={"2xl"}>
            {t("application.review.confirmation.title")}
            {listing?.name}
          </Heading>
        </CardSection>

        {imageUrl && <img src={imageUrl} alt={listing?.name} />}

        <CardSection divider={"flush"}>
          <h2 className="form-card__paragraph-title">
            {t("application.review.confirmation.lotteryNumber")}
          </h2>

          <p
            id="confirmationCode"
            className="font-serif text-2xl my-1"
            data-testid={"app-confirmation-id"}
          >
            {application.confirmationCode || application.id}
          </p>
          <p className="field-note">{t("application.review.confirmation.pleaseWriteNumber")}</p>
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

        <div className="form-card__pager">
          {initialStateLoaded && !profile && (
            <CardSection className={"bg-primary-lighter border-none"} divider={"flush"}>
              <Button
                variant="primary"
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
            <span className="underline text-sm" data-testid={"app-confirmation-browse"}>
              <Link href="/listings">{t("application.review.confirmation.browseMore")}</Link>
            </span>
          </CardSection>

          <CardSection>
            <span className="underline text-sm" data-testid={"app-confirmation-print"}>
              <Link href="/applications/view">{t("application.review.confirmation.print")}</Link>
            </span>
          </CardSection>
        </div>
      </Card>
    </FormsLayout>
  )
}

export default ApplicationConfirmation
