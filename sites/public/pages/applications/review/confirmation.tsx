/*
5.4 Confirmation
Application confirmation with lottery number (confirmation number)
*/
import React, { useContext, useEffect, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import Markdown from "markdown-to-jsx"
import dayjs from "dayjs"
import {
  AppearanceStyleType,
  ApplicationTimeline,
  Button,
  FormCard,
  t,
} from "@bloom-housing/ui-components"
import { ListingReviewOrder } from "@bloom-housing/backend-core/types"
import {
  imageUrlFromListing,
  PageView,
  pushGtmEvent,
  AuthContext,
  getLotteryEvent,
} from "@bloom-housing/shared-helpers"
import FormsLayout from "../../../layouts/forms"
import { AppSubmissionContext } from "../../../lib/AppSubmissionContext"
import { UserStatus } from "../../../lib/constants"

const ApplicationConfirmation = () => {
  const { application, listing } = useContext(AppSubmissionContext)
  const { initialStateLoaded, profile } = useContext(AuthContext)
  const router = useRouter()

  const imageUrl = imageUrlFromListing(listing, parseInt(process.env.listingPhotoSize))

  const reviewOrder = useMemo(() => {
    if (listing) {
      if (listing.reviewOrderType == ListingReviewOrder.lottery) {
        const lotteryEvent = getLotteryEvent(listing)
        const lotteryText = []
        if (lotteryEvent?.startTime) {
          lotteryText.push(
            t("application.review.confirmation.eligibleApplicants.lotteryDate", {
              lotteryDate: dayjs(lotteryEvent?.startTime).format("MMMM D, YYYY"),
            })
          )
        }
        lotteryText.push(t("application.review.confirmation.eligibleApplicants.lottery"))
        return lotteryText.join(" ")
      } else {
        return t("application.review.confirmation.eligibleApplicants.FCFS")
      }
    } else {
      return ""
    }
  }, [listing])

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Application - Confirmation",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  return (
    <FormsLayout>
      <FormCard>
        <div className="form-card__lead">
          <h1 className="form-card__title is-borderless">
            {t("application.review.confirmation.title")}
            {listing?.name}
          </h1>
        </div>

        {imageUrl && <img src={imageUrl} alt={listing?.name} />}

        <div className="form-card__group border-b text-center">
          <h2 className="form-card__paragraph-title">
            {t("application.review.confirmation.lotteryNumber")}
          </h2>

          <p
            id="confirmationCode"
            className="font-serif text-3xl my-1"
            data-test-id={"app-confirmation-id"}
          >
            {application.confirmationCode || application.id}
          </p>
          <p className="field-note">{t("application.review.confirmation.pleaseWriteNumber")}</p>
        </div>

        <div className="form-card__group border-b markdown markdown-informational">
          <ApplicationTimeline />

          <Markdown options={{ disableParsingRawHTML: true }}>
            {t("application.review.confirmation.whatHappensNext", { reviewOrder })}
          </Markdown>
        </div>

        <div className="form-card__group border-b markdown markdown-informational">
          <Markdown options={{ disableParsingRawHTML: true }}>
            {t("application.review.confirmation.needToMakeUpdates", {
              agentName: listing?.leasingAgentName || "",
              agentPhone: listing?.leasingAgentPhone || "",
              agentEmail: listing?.leasingAgentEmail || "",
              agentOfficeHours: listing?.leasingAgentOfficeHours || "",
            })}
          </Markdown>
        </div>

        {initialStateLoaded && !profile && (
          <div className="form-card__group markdown markdown-informational">
            <Markdown options={{ disableParsingRawHTML: true }}>
              {t("application.review.confirmation.createAccount")}
            </Markdown>
          </div>
        )}

        <div className="form-card__pager">
          {initialStateLoaded && !profile && (
            <div className="form-card__pager-row primary">
              <Button
                styleType={AppearanceStyleType.primary}
                onClick={() => {
                  void router.push("/create-account")
                }}
                data-test-id={"app-confirmation-create-account"}
              >
                {t("account.createAccount")}
              </Button>
            </div>
          )}

          <div className="form-card__pager-row py-6">
            <span className="lined text-tiny" data-test-id={"app-confirmation-browse"}>
              <Link href="/listings">{t("application.review.confirmation.browseMore")}</Link>
            </span>
          </div>

          <div className="form-card__pager-row py-6 border-t">
            <span className="lined text-tiny" data-test-id={"app-confirmation-print"}>
              <Link href="/applications/view">{t("application.review.confirmation.print")}</Link>
            </span>
          </div>
        </div>
      </FormCard>
    </FormsLayout>
  )
}

export default ApplicationConfirmation
