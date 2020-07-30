/*
5.2 Summary
Display a summary of application fields with edit links per section
*/
import Link from "next/link"
import Router from "next/router"
import { Address } from "@bloom-housing/core"
import { Button, FormCard, ProgressNav, MultiLineAddress, t } from "@bloom-housing/ui-components"
import FormsLayout from "../../../layouts/forms"
import { useForm } from "react-hook-form"
import { AppSubmissionContext } from "../../../lib/AppSubmissionContext"
import ApplicationConductor from "../../../lib/ApplicationConductor"
import { useContext, useMemo, ReactNode, Fragment } from "react"

const EditLink = (props: { href: string }) => (
  <div className="float-right flex">
    <Link href={props.href}>
      <a className="edit-link">{t("label.edit")}</a>
    </Link>
  </div>
)

const ReviewItem = (props: { label: string; sublabel?: string; children?: ReactNode }) => (
  <p className="info-item mb-4">
    <span className="info-item__label">{props.label}</span>
    {props.children && (
      <>
        <br />
        <span className="info-item__value">{props.children}</span>
      </>
    )}
    {props.sublabel && (
      <>
        <br />
        <span className="info-item__helper">{props.sublabel}</span>
      </>
    )}
  </p>
)

const reformatAddress = (address: any) => {
  const { street, street2, city, state, zipCode } = address
  const newAddress = {
    placeName: street,
    street: street2,
    city,
    state,
    zipCode,
  } as Address
  if (newAddress.street === null || newAddress.street === "") {
    newAddress.street = newAddress.placeName
    delete newAddress.placeName
  }
  return newAddress
}

const accessibilityLabels = (accessibility) => {
  const labels = []
  if (accessibility.mobility) labels.push(t("application.ada.mobility"))
  if (accessibility.vision) labels.push(t("application.ada.vision"))
  if (accessibility.hearing) labels.push(t("application.ada.hearing"))
  if (labels.length === 0) labels.push(t("t.no"))

  return labels
}

export default () => {
  const context = useContext(AppSubmissionContext)
  const { application, listing } = context
  const conductor = useMemo(() => new ApplicationConductor(application, listing, context), [
    application,
    listing,
    context,
  ])
  const currentPageStep = 5

  /* Form Handler */
  const { handleSubmit } = useForm()
  const onSubmit = (data) => {
    console.log(data)

    Router.push("/applications/review/terms").then(() => window.scrollTo(0, 0))
  }

  return (
    <FormsLayout>
      <FormCard header="LISTING">
        <ProgressNav
          currentPageStep={currentPageStep}
          completedSteps={application.completedStep}
          labels={["You", "Household", "Income", "Preferences", "Review"]}
        />
      </FormCard>

      <FormCard>
        <p className="form-card__back">
          <strong>
            <Link href="/applications/review/demographics">
              <a>{t("t.back")}</a>
            </Link>
          </strong>
        </p>

        <div className="form-card__lead">
          <h2 className="form-card__title is-borderless">
            {t("application.review.takeAMomentToReview")}
          </h2>
        </div>

        <h3 className="form--card__sub-header">
          {t("t.you")}
          <EditLink href="/applications/contact/name" />
        </h3>

        <div className="form-card__group mx-0">
          <ReviewItem label={t("t.name")}>
            {application.applicant.firstName} {application.applicant.middleName}{" "}
            {application.applicant.lastName}
          </ReviewItem>

          <ReviewItem label={t("application.household.member.dateOfBirth")}>
            {application.applicant.birthMonth}/{application.applicant.birthDay}/
            {application.applicant.birthYear}
          </ReviewItem>

          {application.applicant.phoneNumber && (
            <ReviewItem label={t("t.phone")} sublabel={application.applicant.phoneNumberType}>
              {application.applicant.phoneNumber}
            </ReviewItem>
          )}

          {application.additionalPhoneNumber && (
            <ReviewItem
              label={t("t.additionalPhone")}
              sublabel={application.additionalPhoneNumberType}
            >
              {application.additionalPhoneNumber}
            </ReviewItem>
          )}

          {application.applicant.emailAddress && (
            <ReviewItem label={t("label.email")}>{application.applicant.emailAddress}</ReviewItem>
          )}

          <ReviewItem label={t("application.contact.address")}>
            <MultiLineAddress address={reformatAddress(application.applicant.address)} />
          </ReviewItem>

          {application.sendMailToMailingAddress && (
            <ReviewItem label={t("application.contact.mailingAddress")}>
              <MultiLineAddress address={reformatAddress(application.mailingAddress)} />
            </ReviewItem>
          )}

          {application.applicant.workInRegion === "yes" && (
            <ReviewItem label={t("application.contact.workAddress")}>
              <MultiLineAddress address={reformatAddress(application.applicant.workAddress)} />
            </ReviewItem>
          )}
        </div>

        {application.alternateContact.type !== "" &&
          application.alternateContact.type !== "noContact" && (
            <>
              <h3 className="form--card__sub-header">
                {t("application.alternateContact.type.label")}
                <EditLink href="/applications/contact/alternate-contact-type" />
              </h3>
              <div className="form-card__group mx-0">
                <ReviewItem
                  label={t(
                    `application.alternateContact.type.options.${application.alternateContact.type}`
                  )}
                >
                  {application.alternateContact.firstName} {application.alternateContact.lastName}
                  <br />
                  {application.alternateContact.phoneNumber}
                  <br />
                  {application.alternateContact.emailAddress}
                </ReviewItem>
              </div>
            </>
          )}

        <h3 className="form--card__sub-header">
          {t("application.household.householdMembers")}
          <EditLink href="/applications/household/add-members" />
        </h3>

        {application.householdSize > 0 && (
          <div className="form-card__group info-group mx-0">
            {application.householdMembers.map((member) => (
              <div className="info-group__item" key={`${member.firstName} - ${member.lastName}`}>
                <p className="info-item__value">
                  {member.firstName} {member.lastName}
                </p>
                <div>
                  <ReviewItem label={t("application.household.member.dateOfBirth")}>
                    {member.birthMonth}/{member.birthDay}/{member.birthYear}
                  </ReviewItem>
                  {member.sameAddress === "no" && (
                    <ReviewItem label={t("application.contact.address")}>
                      <MultiLineAddress address={reformatAddress(member.address)} />
                    </ReviewItem>
                  )}
                  {member.sameAddress !== "no" && (
                    <ReviewItem label={t("application.review.sameAddressAsApplicant")}></ReviewItem>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        {application.householdSize === 0 && (
          <div className="form-card__group mx-0">{t("application.review.noAdditionalMembers")}</div>
        )}

        <h3 className="form--card__sub-header">
          {t("application.review.householdDetails")}
          <EditLink href="/applications/household/ada" />
        </h3>

        <div className="form-card__group mx-0">
          <ReviewItem label={t("application.ada.label")}>
            {accessibilityLabels(application.accessibility).map((item) => (
              <Fragment key={item}>
                {item}
                <br />
              </Fragment>
            ))}
          </ReviewItem>
        </div>

        <h3 className="form--card__sub-header">
          {t("t.income")}
          <EditLink href="/applications/financial/vouchers" />
        </h3>

        <div className="form-card__group border-b mx-0">
          <ReviewItem label={t("application.review.voucherOrSubsidy")}>
            {application.incomeVouchers ? t("t.yes") : t("t.no")}
          </ReviewItem>

          <ReviewItem label={t("t.income")}>
            ${application.income} {t(`application.financial.income.${application.incomePeriod}`)}
          </ReviewItem>
        </div>

        <div className="form-card__group">
          <p className="field-note text-gray-800 text-center">
            {t("application.review.lastChanceToEdit")}
          </p>
        </div>

        <div className="form-card__pager">
          <div className="form-card__pager-row primary">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Button
                filled={true}
                onClick={() => {
                  //
                }}
              >
                {t("t.confirm")}
              </Button>
            </form>
          </div>
        </div>
      </FormCard>
    </FormsLayout>
  )
}
