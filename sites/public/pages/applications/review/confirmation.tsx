/*
5.4 Confirmation
Application confirmation with lottery number (confirmation number)
*/
import React, { useContext, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { AppearanceStyleType, Button, FormCard, AuthContext, t } from "@bloom-housing/ui-components"
import { imageUrlFromListing, PageView, pushGtmEvent } from "@bloom-housing/shared-helpers"

import FormsLayout from "../../../layouts/forms"
import { AppSubmissionContext } from "../../../lib/AppSubmissionContext"
import { UserStatus } from "../../../lib/constants"

const ApplicationConfirmation = () => {
  const { application, listing } = useContext(AppSubmissionContext)
  const { initialStateLoaded, profile } = useContext(AuthContext)
  const router = useRouter()

  const imageUrl = imageUrlFromListing(listing, parseInt(process.env.listingPhotoSize))

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
          <h2 className="form-card__title is-borderless">
            {t("application.review.confirmation.title")}
            {listing?.name}
          </h2>
        </div>

        {imageUrl && <img src={imageUrl} alt={listing?.name} />}

        <div className="form-card__group border-b text-center">
          <h3 className="form-card__paragraph-title">
            {t("application.review.confirmation.lotteryNumber")}
          </h3>

          <p
            id="confirmationCode"
            className="font-serif text-3xl my-1"
            data-test-id={"app-confirmation-id"}
          >
            {application.confirmationCode || application.id}
          </p>
          <p className="field-note">{t("application.review.confirmation.pleaseWriteNumber")}</p>
        </div>

        <div className="form-card__group border-b">
          <h3 className="form-card__paragraph-title">
            {t("application.review.confirmation.whatExpectTitle")}
          </h3>

          <p className="field-note mt-2">
            {t("application.review.confirmation.whatExpectSecondparagraph")}
          </p>
        </div>

        <div className="form-card__group border-b">
          <h3 className="form-card__paragraph-title">
            {t("application.review.confirmation.doNotSubmitTitle")}
          </h3>

          <p className="field-note mt-1">{t("application.review.confirmation.needToUpdate")}</p>

          {listing && (
            <p className="field-note mt-2">
              {listing.leasingAgentName}
              <br />
              {listing.leasingAgentPhone}
              <br />
              {listing.leasingAgentEmail}
            </p>
          )}
        </div>

        {initialStateLoaded && !profile && (
          <div className="form-card__group">
            <h3 className="form-card__paragraph-title">
              {t("application.review.confirmation.createAccountTitle")}
            </h3>

            <p className="field-note mt-1">
              {t("application.review.confirmation.createAccountParagraph")}
            </p>
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
            <a className="lined text-tiny" href="/" data-test-id={"app-confirmation-done"}>
              {t("application.review.confirmation.imdone")}
            </a>
          </div>

          <div className="form-card__pager-row py-6">
            <Link href="/listings" data-test-id={"app-confirmation-browse"}>
              <a className="lined text-tiny">{t("application.review.confirmation.browseMore")}</a>
            </Link>
          </div>

          <div className="form-card__pager-row py-6 border-t">
            <Link href="/applications/view" data-test-id={"app-confirmation-print"}>
              <a className="lined text-tiny">{t("application.review.confirmation.print")}</a>
            </Link>
          </div>
        </div>
      </FormCard>
    </FormsLayout>
  )
}

export default ApplicationConfirmation
