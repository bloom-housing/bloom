import React, { Fragment, useEffect, useState } from "react"
import { LocalizedLink, MultiLineAddress, ViewItem, t } from "@bloom-housing/ui-components"
import { getUniqueUnitTypes } from "@bloom-housing/ui-components/src/helpers/unitTypes"
import { Address, AllExtraDataTypes, InputType, Listing } from "@bloom-housing/backend-core/types"

type FormSummaryDetailsProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  application: any
  listing: Listing
  editMode?: boolean
  hidePreferences?: boolean
}

const EditLink = (props: { href: string }) => (
  <div className="float-right flex">
    <LocalizedLink href={props.href}>
      <a className="edit-link">{t("t.edit")}</a>
    </LocalizedLink>
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

const FormSummaryDetails = ({
  application,
  listing,
  editMode = false,
  hidePreferences = false,
}: FormSummaryDetailsProps) => {
  // fix for rehydration
  const [hasMounted, setHasMounted] = useState(false)
  useEffect(() => {
    setHasMounted(true)
  }, [])
  if (!hasMounted) {
    return null
  }

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

  const preferenceHelperText = (extraData?: AllExtraDataTypes[]) => {
    if (!extraData) return

    return extraData.reduce((acc, item) => {
      if (
        item.type === InputType.text ||
        (item.type === InputType.hhMemberSelect && typeof item.value === "string")
      ) {
        acc += `${item.value.toString()}, `
      }

      if (item.type === InputType.address && typeof item.value === "object") {
        acc += `
          ${item.value.street},
          ${item.value.street2 ?? ""},
          ${item.value.city},
          ${item.value.state}
          ${item.value.zipCode}
          `
      }

      return acc
    }, "")
  }

  const allListingUnitTypes = getUniqueUnitTypes(listing?.units)

  const preferredUnits = application.preferredUnit?.map((unit) => {
    const unitDetails = allListingUnitTypes?.find((unitType) => unitType.id === unit.id)
    return unitDetails?.name
  })

  return (
    <>
      <h3 className="form--card__sub-header">
        {t("t.you")}
        {editMode && <EditLink href="/applications/contact/name" />}
      </h3>

      <div className="form-card__group mx-0">
        <ViewItem id="applicantName" label={t("t.name")}>
          {application.applicant.firstName} {application.applicant.middleName}{" "}
          {application.applicant.lastName}
        </ViewItem>

        <ViewItem id="applicantbirthDay" label={t("application.household.member.dateOfBirth")}>
          {application.applicant.birthMonth}/{application.applicant.birthDay}/
          {application.applicant.birthYear}
        </ViewItem>

        {application.applicant.phoneNumber && (
          <ViewItem
            id="applicantPhone"
            label={t("t.phone")}
            helper={t(
              `application.contact.phoneNumberTypes.${application.applicant.phoneNumberType}`
            )}
          >
            {application.applicant.phoneNumber}
          </ViewItem>
        )}

        {application.additionalPhoneNumber && (
          <ViewItem
            id="applicantAdditionalPhone"
            label={t("t.additionalPhone")}
            helper={t(
              `application.contact.phoneNumberTypes.${application.additionalPhoneNumberType}`
            )}
          >
            {application.additionalPhoneNumber}
          </ViewItem>
        )}

        {application.applicant.emailAddress && (
          <ViewItem id="applicantEmail" label={t("t.email")}>
            {application.applicant.emailAddress}
          </ViewItem>
        )}

        <ViewItem id="applicantAddress" label={t("application.contact.address")}>
          <MultiLineAddress address={reformatAddress(application.applicant.address)} />
        </ViewItem>

        {application.sendMailToMailingAddress && (
          <ViewItem id="applicantMailingAddress" label={t("application.contact.mailingAddress")}>
            <MultiLineAddress address={reformatAddress(application.mailingAddress)} />
          </ViewItem>
        )}

        {application.applicant.workInRegion === "yes" && (
          <ViewItem id="applicantWorkAddress" label={t("application.contact.workAddress")}>
            <MultiLineAddress address={reformatAddress(application.applicant.workAddress)} />
          </ViewItem>
        )}

        {application.contactPreferences && (
          <ViewItem
            id="applicantPreferredContactType"
            label={t("application.contact.preferredContactType")}
          >
            {application.contactPreferences?.map((item) => t(`t.${item}`)).join(", ")}
          </ViewItem>
        )}
      </div>

      {application.alternateContact.type !== "" &&
        application.alternateContact.type !== "noContact" && (
          <div id="alternateContact">
            <h3 className="form--card__sub-header">
              {t("application.alternateContact.type.label")}
              {editMode && <EditLink href="/applications/contact/alternate-contact-type" />}
            </h3>

            <div className="form-card__group mx-0">
              <p className="field-note mb-5">
                {t(`application.alternateContact.type.description`)}
              </p>
              <ViewItem id="alternateName" label={t("t.name")} helper={alternateContactName()}>
                {application.alternateContact.firstName} {application.alternateContact.lastName}
              </ViewItem>

              {application.alternateContact.emailAddress && (
                <ViewItem id="alternateEmail" label={t("t.email")}>
                  {application.alternateContact.emailAddress}
                </ViewItem>
              )}

              {application.alternateContact.phoneNumber && (
                <ViewItem id="alternatePhone" label={t("t.phone")}>
                  {application.alternateContact.phoneNumber}
                </ViewItem>
              )}

              {Object.values(application.alternateContact.mailingAddress).some(
                (value) => value !== ""
              ) && (
                <ViewItem id="alternateMailingAddress" label={t("application.contact.address")}>
                  <MultiLineAddress address={application.alternateContact.mailingAddress} />
                </ViewItem>
              )}
            </div>
          </div>
        )}

      {application.householdSize > 1 && (
        <div id="householdMembers">
          <h3 className="form--card__sub-header">
            {t("application.household.householdMembers")}
            {editMode && <EditLink href="/applications/household/add-members" />}
          </h3>

          <div id="members" className="form-card__group info-group mx-0">
            {application.householdMembers.map((member, index) => (
              <div
                className="info-group__item"
                key={`${member.firstName} - ${member.lastName} - ${index}`}
              >
                <ViewItem>
                  {member.firstName} {member.lastName}
                </ViewItem>
                <div>
                  <ViewItem label={t("application.household.member.dateOfBirth")}>
                    {member.birthMonth}/{member.birthDay}/{member.birthYear}
                  </ViewItem>
                  {member.sameAddress === "no" && (
                    <ViewItem label={t("application.contact.address")}>
                      <MultiLineAddress address={reformatAddress(member.address)} />
                    </ViewItem>
                  )}
                  {member.sameAddress !== "no" && (
                    <ViewItem label={t("application.review.sameAddressAsApplicant")}></ViewItem>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div id="householdDetails">
        <h3 className="form--card__sub-header">
          {t("application.review.householdDetails")}
          {editMode && <EditLink href="/applications/household/preferred-units" />}
        </h3>

        <div className="form-card__group mx-0">
          {preferredUnits && (
            <ViewItem
              id="householdUnitType"
              label={t("application.household.preferredUnit.preferredUnitType")}
            >
              {preferredUnits
                ?.map((item) => t(`application.household.preferredUnit.options.${item}`))
                .join(", ")}
            </ViewItem>
          )}
          <ViewItem id="householdAda" label={t("application.ada.label")}>
            {accessibilityLabels(application.accessibility).map((item) => (
              <Fragment key={item}>
                {item}
                <br />
              </Fragment>
            ))}
          </ViewItem>
        </div>

        <h3 className="form--card__sub-header">
          {t("t.income")}
          {editMode && <EditLink href="/applications/financial/vouchers" />}
        </h3>

        <div className="form-card__group border-b mx-0">
          <ViewItem id="incomeVouchers" label={t("application.review.voucherOrSubsidy")}>
            {application.incomeVouchers ? t("t.yes") : t("t.no")}
          </ViewItem>

          {application.incomePeriod && (
            <ViewItem id="incomeValue" label={t("t.income")}>
              ${application.income} {t(`t.${application.incomePeriod}`)}
            </ViewItem>
          )}
        </div>

        {!hidePreferences && (
          <>
            <h3 className="form--card__sub-header">
              {t("t.preferences")}
              {editMode && <EditLink href="/applications/preferences/all" />}
            </h3>
            <div id="preferences" className="form-card__group border-b mx-0">
              {application.preferences.filter((item) => item.claimed == true).length == 0 ? (
                <p className="field-note text-black">
                  {t("application.preferences.general.title", {
                    county: listing?.countyCode,
                  })}{" "}
                  {t("application.preferences.general.preamble")}
                </p>
              ) : (
                <>
                  {application.preferences
                    .filter((item) => item.claimed === true)
                    .map((preference) =>
                      preference.options
                        .filter((item) => item.checked === true)
                        .map((option, index) => (
                          <ViewItem
                            label={t("application.preferences.youHaveClaimed")}
                            helper={preferenceHelperText(option?.extraData)}
                            key={index}
                          >
                            {t(`application.preferences.${preference.key}.${option.key}.label`, {
                              county: listing?.countyCode,
                            })}
                          </ViewItem>
                        ))
                    )}
                </>
              )}
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default FormSummaryDetails
