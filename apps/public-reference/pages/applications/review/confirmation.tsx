/*
5.4 Confirmation
Application confirmation with lottery number (confirmation number) 
*/
import Link from "next/link"
import Router from "next/router"
import { Button, FormCard, t } from "@bloom-housing/ui-components"
import FormsLayout from "../../../layouts/forms"
import { AppSubmissionContext } from "../../../lib/AppSubmissionContext"
import { useContext } from "react"

export default () => {
  const { listing } = useContext(AppSubmissionContext)

  return (
    <FormsLayout>
      <FormCard>
        <div className="form-card__lead">
          <h2 className="form-card__title is-borderless">
            {t("application.review.confirmation.title")}
            {listing?.name}
          </h2>
        </div>

        {listing?.imageUrl && <img src={listing.imageUrl} alt={listing?.name} />}

        <div className="form-card__group border-b text-center">
          <h3 className="form-card__paragraph-title">
            {t("application.review.confirmation.lotteryNumber")}
          </h3>
          {/* TODO: replace with real application number */}
          <p className="font-serif text-3xl my-1">#00545847</p>
          <p className="field-note">{t("application.review.confirmation.pleaseWriteNumber")}</p>
        </div>

        <div className="form-card__group border-b">
          <h3 className="form-card__paragraph-title">
            {t("application.review.confirmation.whatExpectTitle")}
          </h3>

          <p className="field-note mt-1">
            {t("application.review.confirmation.whatExpectFirstParagraph.held")}
            {/* TODO: replace with real date */}
            ###
            {t("application.review.confirmation.whatExpectFirstParagraph.attend")}
            {/* TODO: url slug seems to be not completed */}
            {listing?.urlSlug && (
              <Link
                href={`listing/id=${listing.id}`}
                as={`/listing/${listing.id}/${listing.urlSlug}`}
              >
                <a>{t("application.review.confirmation.whatExpectFirstParagraph.listing")}</a>
              </Link>
            )}
            {t("application.review.confirmation.whatExpectFirstParagraph.refer")}
          </p>

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

        <div className="form-card__group">
          <h3 className="form-card__paragraph-title">
            {t("application.review.confirmation.createAccountTitle")}
          </h3>

          <p className="field-note mt-1">
            {t("application.review.confirmation.createAccountParagraph")}
          </p>
        </div>

        <div className="form-card__pager">
          <div className="form-card__pager-row primary">
            <Button
              filled={true}
              onClick={() => {
                Router.push("/create-account").then(() => window.scrollTo(0, 0))
              }}
            >
              {t("application.form.general.createAccount")}
            </Button>
          </div>

          <div className="form-card__pager-row py-6">
            <a className="lined text-tiny" href="/">
              {t("application.review.confirmation.imdone")}
            </a>
          </div>

          <div className="form-card__pager-row py-6">
            <Link href="/listings">
              <a className="lined text-tiny">{t("application.review.confirmation.browseMore")}</a>
            </Link>
          </div>

          <div className="form-card__pager-row py-6 border-t">
            <Link href="/applications/view">
              <a className="lined text-tiny">{t("application.review.confirmation.print")}</a>
            </Link>
          </div>
        </div>
      </FormCard>
    </FormsLayout>
  )
}
