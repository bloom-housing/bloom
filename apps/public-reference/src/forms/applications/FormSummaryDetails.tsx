import React, { ReactNode } from "react"
import Link from "next/link"
import { MultiLineAddress, t } from "@bloom-housing/ui-components"
import { Address } from "@bloom-housing/core"

const FormCardReviewItem = (props: { label: string; sublabel?: string; children?: ReactNode }) => (
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

const EditLink = (props: { href: string }) => (
  <div className="float-right flex">
    <Link href={props.href}>
      <a className="edit-link">{t("label.edit")}</a>
    </Link>
  </div>
)

const accessibilityLabels = (accessibility) => {
  const labels = []
  if (accessibility.mobility) labels.push(t("application.ada.mobility"))
  if (accessibility.vision) labels.push(t("application.ada.vision"))
  if (accessibility.hearing) labels.push(t("application.ada.hearing"))
  if (labels.length === 0) labels.push(t("t.no"))

  return labels
}

const reformatAddress = (address: Address) => {
  const { street, street2, city, state, zipCode } = address
  const newAddress = {
    placeName: street,
    street: street2,
    city,
    state,
    zipCode,
  } as Address
  if (newAddress.street === null || newAddress.street === "") {
    if (newAddress.placeName) {
      newAddress.street = newAddress.placeName
      delete newAddress.placeName
    }
  }
  return newAddress
}

const FormSummaryDetails = ({ application, editMode = false }) => {
  return (
    <>
      <h3 className="form--card__sub-header">
        {t("t.you")}
        {editMode && <EditLink href="/applications/contact/name" />}
      </h3>

      <div className="form-card__group mx-0">
        <FormCardReviewItem label={t("t.name")}>
          {application.applicant.firstName} {application.applicant.middleName}{" "}
          {application.applicant.lastName}
        </FormCardReviewItem>

        <FormCardReviewItem label={t("application.household.member.dateOfBirth")}>
          {application.applicant.birthMonth}/{application.applicant.birthDay}/
          {application.applicant.birthYear}
        </FormCardReviewItem>

        {application.applicant.phoneNumber && (
          <FormCardReviewItem label={t("t.phone")} sublabel={application.applicant.phoneNumberType}>
            {application.applicant.phoneNumber}
          </FormCardReviewItem>
        )}

        {application.additionalPhoneNumber && (
          <FormCardReviewItem
            label={t("t.additionalPhone")}
            sublabel={application.additionalPhoneNumberType}
          >
            {application.additionalPhoneNumber}
          </FormCardReviewItem>
        )}

        {application.applicant.emailAddress && (
          <FormCardReviewItem label={t("label.email")}>
            {application.applicant.emailAddress}
          </FormCardReviewItem>
        )}

        <FormCardReviewItem label={t("application.contact.address")}>
          <MultiLineAddress address={reformatAddress(application.applicant.address)} />
        </FormCardReviewItem>

        {application.sendMailToMailingAddress && (
          <FormCardReviewItem label={t("application.contact.mailingAddress")}>
            <MultiLineAddress address={reformatAddress(application.mailingAddress)} />
          </FormCardReviewItem>
        )}

        {application.applicant.workInRegion === "yes" && (
          <FormCardReviewItem label={t("application.contact.workAddress")}>
            <MultiLineAddress address={reformatAddress(application.applicant.workAddress)} />
          </FormCardReviewItem>
        )}
      </div>

      {application.alternateContact.type !== "" &&
        application.alternateContact.type !== "noContact" && (
          <>
            <h3 className="form--card__sub-header">
              {t("application.alternateContact.type.label")}
              {editMode && <EditLink href="/applications/contact/alternate-contact-type" />}
            </h3>
            <div className="form-card__group mx-0">
              <FormCardReviewItem
                label={t(
                  `application.alternateContact.type.options.${application.alternateContact.type}`
                )}
              >
                {application.alternateContact.firstName} {application.alternateContact.lastName}
                <br />
                {application.alternateContact.phoneNumber}
                <br />
                {application.alternateContact.emailAddress}
              </FormCardReviewItem>
            </div>
          </>
        )}

      <h3 className="form--card__sub-header">
        {t("application.household.householdMembers")}
        {editMode && <EditLink href="/applications/household/add-members" />}
      </h3>

      {application.householdSize > 0 && (
        <div className="form-card__group info-group mx-0">
          {application.householdMembers.map((member) => (
            <div className="info-group__item">
              <p className="info-item__value">
                {member.firstName} {member.lastName}
              </p>
              <div>
                <FormCardReviewItem label={t("application.household.member.dateOfBirth")}>
                  {member.birthMonth}/{member.birthDay}/{member.birthYear}
                </FormCardReviewItem>
                {member.sameAddress === "no" && (
                  <FormCardReviewItem label={t("application.contact.address")}>
                    <MultiLineAddress address={reformatAddress(member.address)} />
                  </FormCardReviewItem>
                )}
                {member.sameAddress !== "no" && (
                  <FormCardReviewItem
                    label={t("application.review.sameAddressAsApplicant")}
                  ></FormCardReviewItem>
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
        {editMode && <EditLink href="/applications/household/ada" />}
      </h3>

      <div className="form-card__group mx-0">
        <FormCardReviewItem label={t("application.ada.label")}>
          {accessibilityLabels(application.accessibility).map((item) => (
            <>
              {item}
              <br />
            </>
          ))}
        </FormCardReviewItem>
      </div>

      <h3 className="form--card__sub-header">
        {t("t.income")}
        {editMode && <EditLink href="/applications/financial/vouchers" />}
      </h3>

      <div className="form-card__group border-b mx-0">
        <FormCardReviewItem label={t("application.review.voucherOrSubsidy")}>
          {application.incomeVouchers ? t("t.yes") : t("t.no")}
        </FormCardReviewItem>

        <FormCardReviewItem label={t("t.income")}>
          ${application.income} {t(`application.financial.income.${application.incomePeriod}`)}
        </FormCardReviewItem>
      </div>
    </>
  )
}

export default FormSummaryDetails
