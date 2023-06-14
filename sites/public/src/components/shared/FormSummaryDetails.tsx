import React, { Fragment, useEffect, useState } from "react"
import { LocalizedLink, MultiLineAddress, t } from "@bloom-housing/ui-components"
import { FieldValue } from "@bloom-housing/ui-seeds"
import { getUniqueUnitTypes } from "@bloom-housing/shared-helpers"
import {
  Address,
  AllExtraDataTypes,
  ApplicationMultiselectQuestion,
  ApplicationMultiselectQuestionOption,
  ApplicationSection,
  InputType,
  Listing,
} from "@bloom-housing/backend-core/types"

type FormSummaryDetailsProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  application: any
  listing: Listing
  editMode?: boolean
  hidePreferences?: boolean
  hidePrograms?: boolean
  validationError?: boolean
}

const EditLink = (props: { href: string }) => (
  <div className="float-right flex edit-link">
    <LocalizedLink href={props.href} className={"text-blue-700"}>
      {t("t.edit")}
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
  hidePrograms = false,
  validationError = false,
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

  const multiselectQuestionAddress = (extraData?: AllExtraDataTypes[]) => {
    if (!extraData) return
    return extraData.reduce((acc, item) => {
      if (item.type === InputType.address && typeof item.value === "object") {
        acc += `
          ${item.value.street}${!item.value.street2 && ","}
          ${item.value.street2 ? `${item.value.street2},` : ""}
          ${item.value.city},
          ${item.value.state}
          ${item.value.zipCode}
          `
      }

      return acc
    }, "")
  }

  const multiselectQuestionSection = (
    applicationSection: ApplicationSection,
    appLink: string,
    header: string,
    emptyText?: string,
    className?: string
  ) => {
    return (
      <>
        <h3 className="form--card__sub-header">
          {header}
          {editMode && !validationError && <EditLink href={appLink} />}
        </h3>
        <div
          id={applicationSection}
          className={`form-card__group mx-0 ${className ? className : ""}`}
        >
          {emptyText ? (
            <p className="field-note text-black">{emptyText}</p>
          ) : (
            <>
              {application[applicationSection]
                .filter((item) => item.claimed === true)
                .map((question: ApplicationMultiselectQuestion) =>
                  question.options
                    .filter((item) => item.checked === true)
                    .map((option: ApplicationMultiselectQuestionOption, index) => (
                      <FieldValue
                        label={question.key}
                        helper={multiselectQuestionAddress(option?.extraData)}
                        key={index}
                        data-testid={"app-summary-preference"}
                      >
                        {option.key}
                      </FieldValue>
                    ))
                )}
            </>
          )}
        </div>
      </>
    )
  }

  const allListingUnitTypes = getUniqueUnitTypes(listing?.units)

  const preferredUnits = application.preferredUnit?.map((unit) => {
    const unitDetails = allListingUnitTypes?.find((unitType) => unitType.id === unit.id)
    return unitDetails?.name || unit.name
  })

  return (
    <>
      <h3 className="form--card__sub-header">
        {t("t.you")}
        {editMode && <EditLink href="/applications/contact/name" />}
      </h3>

      <div className="form-card__group mx-0">
        <FieldValue data-testid={"app-summary-name"} id="applicantName" label={t("t.name")}>
          {application.applicant.firstName} {application.applicant.middleName}{" "}
          {application.applicant.lastName}
        </FieldValue>

        <FieldValue
          data-testid={"app-summary-dob"}
          id="applicantbirthDay"
          label={t("application.household.member.dateOfBirth")}
        >
          {application.applicant.birthMonth}/{application.applicant.birthDay}/
          {application.applicant.birthYear}
        </FieldValue>

        {application.applicant.phoneNumber && (
          <FieldValue
            data-testid={"app-summary-phone"}
            id="applicantPhone"
            label={t("t.phone")}
            helper={t(
              `application.contact.phoneNumberTypes.${application.applicant.phoneNumberType}`
            )}
          >
            {application.applicant.phoneNumber}
          </FieldValue>
        )}

        {application.additionalPhoneNumber && (
          <FieldValue
            data-testid={"app-summary-additional-phone"}
            id="applicantAdditionalPhone"
            label={t("t.additionalPhone")}
            helper={t(
              `application.contact.phoneNumberTypes.${application.additionalPhoneNumberType}`
            )}
          >
            {application.additionalPhoneNumber}
          </FieldValue>
        )}

        {application.applicant.emailAddress && (
          <FieldValue data-testid={"app-summary-email"} id="applicantEmail" label={t("t.email")}>
            {application.applicant.emailAddress}
          </FieldValue>
        )}

        <FieldValue id="applicantAddress" label={t("application.contact.address")}>
          <MultiLineAddress
            data-testid={"app-summary-address"}
            address={reformatAddress(application.applicant.address)}
          />
        </FieldValue>

        {application.sendMailToMailingAddress && (
          <FieldValue id="applicantMailingAddress" label={t("application.contact.mailingAddress")}>
            <MultiLineAddress
              data-testid={"app-summary-mailing-address"}
              address={reformatAddress(application.mailingAddress)}
            />
          </FieldValue>
        )}

        {application.applicant.workInRegion === "yes" && (
          <FieldValue id="applicantWorkAddress" label={t("application.contact.workAddress")}>
            <MultiLineAddress
              data-testid={"app-summary-work-address"}
              address={reformatAddress(application.applicant.workAddress)}
            />
          </FieldValue>
        )}

        {application.contactPreferences && (
          <FieldValue
            data-testid={"app-summary-contact-type"}
            id="applicantPreferredContactType"
            label={t("application.contact.preferredContactType")}
          >
            {application.contactPreferences?.map((item) => t(`t.${item}`)).join(", ")}
          </FieldValue>
        )}
      </div>

      {application.alternateContact.type !== "" &&
        application.alternateContact.type !== "noContact" && (
          <div id="alternateContact">
            <h3 className="form--card__sub-header">
              {t("application.alternateContact.type.label")}
              {editMode && !validationError && (
                <EditLink href="/applications/contact/alternate-contact-type" />
              )}
            </h3>

            <div className="form-card__group mx-0">
              <p className="field-note mb-5">
                {t(`application.alternateContact.type.description`)}
              </p>
              <FieldValue
                data-testid={"app-summary-alternate-name"}
                id="alternateName"
                label={t("t.name")}
                helper={alternateContactName()}
              >
                {application.alternateContact.firstName} {application.alternateContact.lastName}
              </FieldValue>

              {application.alternateContact.emailAddress && (
                <FieldValue
                  data-testid={"app-summary-alternate-email"}
                  id="alternateEmail"
                  label={t("t.email")}
                >
                  {application.alternateContact.emailAddress}
                </FieldValue>
              )}

              {application.alternateContact.phoneNumber && (
                <FieldValue
                  data-testid={"app-summary-alternate-phone"}
                  id="alternatePhone"
                  label={t("t.phone")}
                >
                  {application.alternateContact.phoneNumber}
                </FieldValue>
              )}

              {Object.values(application.alternateContact.mailingAddress).some(
                (value) => value !== ""
              ) && (
                <FieldValue
                  data-testid={"app-summary-alternate-mailing-address"}
                  id="alternateMailingAddress"
                  label={t("application.contact.address")}
                >
                  <MultiLineAddress address={application.alternateContact.mailingAddress} />
                </FieldValue>
              )}
            </div>
          </div>
        )}

      {application.householdSize > 1 && (
        <div id="householdMembers">
          <h3 className="form--card__sub-header">
            {t("application.household.householdMembers")}
            {editMode && !validationError && (
              <EditLink href="/applications/household/add-members" />
            )}
          </h3>

          <div id="members" className="form-card__group info-group mx-0">
            {application.householdMembers.map((member, index) => (
              <div
                className="info-group__item"
                key={`${member.firstName} - ${member.lastName} - ${index}`}
              >
                <FieldValue data-testid={"app-summary-household-member-name"}>
                  {member.firstName} {member.lastName}
                </FieldValue>
                <div>
                  <FieldValue
                    data-testid={"app-summary-household-member-dob"}
                    label={t("application.household.member.dateOfBirth")}
                  >
                    {member.birthMonth}/{member.birthDay}/{member.birthYear}
                  </FieldValue>
                  {member.sameAddress === "no" && (
                    <FieldValue label={t("application.contact.address")}>
                      <MultiLineAddress
                        data-testid={"app-summary-household-member-address"}
                        address={reformatAddress(member.address)}
                      />
                    </FieldValue>
                  )}
                  {member.sameAddress !== "no" && (
                    <FieldValue
                      data-testid={"app-summary-household-member-same-address"}
                      label={t("application.review.sameAddressAsApplicant")}
                    ></FieldValue>
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
          {editMode && !validationError && (
            <EditLink href="/applications/household/preferred-units" />
          )}
        </h3>

        <div className="form-card__group mx-0">
          {preferredUnits && (
            <FieldValue
              data-testid={"app-summary-preferred-units"}
              id="householdUnitType"
              label={t("application.household.preferredUnit.preferredUnitType")}
            >
              {preferredUnits
                ?.map((item) => t(`application.household.preferredUnit.options.${item}`))
                .join(", ")}
            </FieldValue>
          )}
          <FieldValue
            data-testid={"app-summary-ada"}
            id="householdAda"
            label={t("application.ada.label")}
          >
            {accessibilityLabels(application.accessibility).map((item) => (
              <Fragment key={item}>
                {item}
                <br />
              </Fragment>
            ))}
          </FieldValue>
          <FieldValue
            id="householdChanges"
            label={t("application.household.expectingChanges.title")}
          >
            {application.householdExpectingChanges ? t("t.yes") : t("t.no")}
          </FieldValue>
          <FieldValue
            id="householdStudent"
            label={t("application.household.householdStudent.title")}
          >
            {application.householdStudent ? t("t.yes") : t("t.no")}
          </FieldValue>
        </div>

        {!hidePrograms &&
          multiselectQuestionSection(
            ApplicationSection.programs,
            "/applications/programs/programs",
            t("t.programs"),
            application.programs.filter((item) => item.claimed == true).length == 0
              ? `${t("application.preferences.general.title", {
                  county: listing?.countyCode,
                })} ${t("application.preferences.general.preamble")}`
              : null
          )}

        <h3 className="form--card__sub-header">
          {t("t.income")}
          {editMode && !validationError && <EditLink href="/applications/financial/vouchers" />}
        </h3>

        <div className="form-card__group mx-0">
          <FieldValue
            data-testid={"app-summary-income-vouchers"}
            id="incomeVouchers"
            label={t("application.review.voucherOrSubsidy")}
          >
            {application.incomeVouchers ? t("t.yes") : t("t.no")}
          </FieldValue>

          {application.incomePeriod && (
            <FieldValue data-testid={"app-summary-income"} id="incomeValue" label={t("t.income")}>
              ${application.income} {t(`t.${application.incomePeriod}`)}
            </FieldValue>
          )}
        </div>

        {!hidePreferences &&
          multiselectQuestionSection(
            ApplicationSection.preferences,
            "/applications/preferences/all",
            t("t.preferences"),
            application.preferences.filter((item) => item.claimed == true).length == 0
              ? `${t("application.preferences.general.title", {
                  county: listing?.countyCode,
                })} ${t("application.preferences.general.preamble")}`
              : null,
            "border-b"
          )}
      </div>
    </>
  )
}

export default FormSummaryDetails
