import React, { ReactNode, Fragment } from "react"
import Link from "next/link"
import { MultiLineAddress, t } from "@bloom-housing/ui-components"
import { Address } from "@bloom-housing/core"

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
  const alternateContactName = () => {
    switch (application.alternateContact.type) {
      case "other":
        return application.alternateContact.otherType
      case "caseManager":
        return application.alternateContact.agency
      case "":
        return ""
      default:
        return t(`application.alternateContact.type.options.${application.alternateContact.type}`)
    }
  }

  return (
    <>
      <h3 className="form--card__sub-header">
        {t("t.you")}
        {editMode && <EditLink href="/applications/contact/name" />}
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
          <ReviewItem
            label={t("t.phone")}
            sublabel={t(
              `application.contact.phoneNumberTypes.${application.applicant.phoneNumberType}`
            )}
          >
            {application.applicant.phoneNumber}
          </ReviewItem>
        )}

        {application.additionalPhoneNumber && (
          <ReviewItem
            label={t("t.additionalPhone")}
            sublabel={t(
              `application.contact.phoneNumberTypes.${application.additionalPhoneNumberType}`
            )}
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

        {application.contactPreferences && (
          <ReviewItem label={t("application.contact.preferredContactType")}>
            {application.contactPreferences
              ?.map((item) => t(`application.form.options.contact.${item}`))
              .join(", ")}
          </ReviewItem>
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
              <p className="field-note mb-5">
                {t(`application.alternateContact.type.description`)}
              </p>
              <ReviewItem label={t("t.name")} sublabel={alternateContactName()}>
                {application.alternateContact.firstName} {application.alternateContact.lastName}
              </ReviewItem>

              {application.alternateContact.emailAddress && (
                <ReviewItem label={t("t.email")}>
                  {application.alternateContact.emailAddress}
                </ReviewItem>
              )}

              {application.alternateContact.phoneNumber && (
                <ReviewItem label={t("t.phone")}>
                  {application.alternateContact.phoneNumber}
                </ReviewItem>
              )}

              {Object.values(application.alternateContact.mailingAddress).some(
                (value) => value !== ""
              ) && (
                <ReviewItem label={t("application.contact.address")}>
                  <MultiLineAddress address={application.alternateContact.mailingAddress} />
                </ReviewItem>
              )}
            </div>
          </>
        )}

      {application.householdSize > 1 && (
        <>
          <h3 className="form--card__sub-header">
            {t("application.household.householdMembers")}
            {editMode && <EditLink href="/applications/household/add-members" />}
          </h3>

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
        </>
      )}

      <h3 className="form--card__sub-header">
        {t("application.review.householdDetails")}
        {editMode && <EditLink href="/applications/household/preferred-units" />}
      </h3>

      <div className="form-card__group mx-0">
        {application.preferredUnit && (
          <ReviewItem label={t("application.household.preferredUnit.preferredUnitType")}>
            {application.preferredUnit
              .map((item) => t(`application.household.preferredUnit.options.${item}`))
              .join(", ")}
          </ReviewItem>
        )}
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
        {editMode && <EditLink href="/applications/financial/vouchers" />}
      </h3>

      <div className="form-card__group border-b mx-0">
        <ReviewItem label={t("application.review.voucherOrSubsidy")}>
          {application.incomeVouchers ? t("t.yes") : t("t.no")}
        </ReviewItem>

        {application.incomePeriod && (
          <ReviewItem label={t("t.income")}>
            ${application.income} {t(`application.financial.income.${application.incomePeriod}`)}
          </ReviewItem>
        )}
      </div>

      <h3 className="form--card__sub-header">
        {t("t.preferences")}
        {editMode && <EditLink href="/applications/preferences/select" />}
      </h3>

      <div className="form-card__group border-b mx-0">
        {application.preferences.none ? (
          <p className="field-note text-black">
            {t("application.preferences.general.title")}{" "}
            {t("application.preferences.general.preamble")}
          </p>
        ) : (
          <>
            {Object.entries(application.preferences)
              .filter((option) => option[0] != "none" && option[1])
              .map((option) => (
                <ReviewItem label={t("application.preferences.youHaveClaimed")}>
                  {t(`application.preferences.${option[0]}.label`)}
                </ReviewItem>
              ))}
          </>
        )}
      </div>
    </>
  )
}

export default FormSummaryDetails
