import React, { Fragment, useEffect, useState } from "react"
import { LocalizedLink, MultiLineAddress, t } from "@bloom-housing/ui-components"
import { FieldValue } from "@bloom-housing/ui-seeds"
import {
  getUniqueUnitTypes,
  AddressHolder,
  cleanMultiselectString,
} from "@bloom-housing/shared-helpers"
import {
  Address,
  AllExtraDataTypes,
  Application,
  ApplicationMultiselectQuestion,
  ApplicationMultiselectQuestionOption,
  InputType,
  Listing,
  MultiselectQuestionsApplicationSectionEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"

type FormSummaryDetailsProps = {
  application: Application
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

  const multiselectQuestionHelpText = (extraData?: AllExtraDataTypes[]) => {
    if (!extraData) return
    const helperText = extraData.reduce((acc, item) => {
      if (item.type === InputType.address && typeof item.value === "object") {
        acc += `${item.value.street} ${!item.value.street2 ? "," : ""} ${
          item.value.street2 ? `${item.value.street2},` : ""
        } ${item.value.city}, ${item.value.state} ${item.value.zipCode}`
      }

      return acc
    }, "")

    const name = extraData.find((field) => field.key === AddressHolder.Name)?.value as string
    const relationship = extraData.find((field) => field.key === AddressHolder.Relationship)
      ?.value as string

    return `${name ? `${name}\n` : ""}${relationship ? `${relationship}\n` : ""}${helperText}`
  }

  const getOptionText = (
    question: ApplicationMultiselectQuestion,
    option: ApplicationMultiselectQuestionOption
  ) => {
    const initialMultiselectQuestion = listing?.listingMultiselectQuestions.find(
      (elem) =>
        cleanMultiselectString(elem.multiselectQuestions.text) ===
        cleanMultiselectString(question.key)
    )

    const initialOption = initialMultiselectQuestion?.multiselectQuestions.options.find(
      (elem) => cleanMultiselectString(elem.text) === option.key
    )

    const initialOptOut = initialMultiselectQuestion?.multiselectQuestions.optOutText

    const optOutOption =
      option.key === cleanMultiselectString(initialOptOut) ? initialOptOut : undefined

    return initialOption?.text || optOutOption || option.key
  }

  const multiselectQuestionSection = (
    applicationSection: MultiselectQuestionsApplicationSectionEnum,
    appLink: string,
    header: string,
    emptyText?: string,
    className?: string
  ) => {
    return (
      <>
        <h3 className="form--card__sub-header border-none text-xl">
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
                        helpText={multiselectQuestionHelpText(option?.extraData)}
                        key={index}
                        testId={question.key}
                        className={"pb-6 whitespace-pre-wrap"}
                      >
                        <div data-testid={option.key}>{getOptionText(question, option)}</div>
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

  const preferredUnits = application.preferredUnitTypes?.map((unit) => {
    const unitDetails = allListingUnitTypes?.find(
      (unitType) => unitType.name === unit.name || unit.id === unitType.id
    )
    return unitDetails?.name || unit.name
  })

  return (
    <>
      <h3 className="form--card__sub-header border-none text-xl">
        {t("t.you")}
        {editMode && <EditLink href="/applications/contact/name" />}
      </h3>

      <div className="form-card__group mx-0">
        <FieldValue
          testId={"app-summary-applicant-name"}
          id="applicantName"
          label={t("t.name")}
          className={"pb-4"}
        >
          {`${application.applicant.firstName}${
            application.applicant.middleName ? ` ${application.applicant.middleName}` : ``
          } ${application.applicant.lastName}`}
        </FieldValue>

        <FieldValue
          testId={"app-summary-applicant-dob"}
          id="applicantbirthDay"
          label={t("application.household.member.dateOfBirth")}
          className={"pb-4"}
        >
          {application.applicant.birthMonth}/{application.applicant.birthDay}/
          {application.applicant.birthYear}
        </FieldValue>

        {application.applicant.phoneNumber && (
          <FieldValue
            testId={"app-summary-applicant-phone"}
            id="applicantPhone"
            label={t("t.phone")}
            helpText={t(
              `application.contact.phoneNumberTypes.${application.applicant.phoneNumberType}`
            )}
            className={"pb-4"}
          >
            {application.applicant.phoneNumber}
          </FieldValue>
        )}

        {application.additionalPhoneNumber && (
          <FieldValue
            testId={"app-summary-applicant-additional-phone"}
            id="applicantAdditionalPhone"
            label={t("t.additionalPhone")}
            helpText={t(
              `application.contact.phoneNumberTypes.${application.additionalPhoneNumberType}`
            )}
            className={"pb-4"}
          >
            {application.additionalPhoneNumber}
          </FieldValue>
        )}

        {application.applicant.emailAddress && (
          <FieldValue
            testId={"app-summary-applicant-email"}
            id="applicantEmail"
            label={t("t.email")}
            className={"pb-4"}
          >
            {application.applicant.emailAddress}
          </FieldValue>
        )}

        <FieldValue
          testId={"app-summary-applicant-address"}
          id="applicantAddress"
          label={t("application.contact.address")}
          className={"pb-4"}
        >
          <MultiLineAddress address={reformatAddress(application.applicant.applicantAddress)} />
        </FieldValue>

        {application.sendMailToMailingAddress && (
          <FieldValue
            testId={"app-summary-applicant-mailing-address"}
            id="applicantMailingAddress"
            label={t("application.contact.mailingAddress")}
            className={"pb-4"}
          >
            <MultiLineAddress address={reformatAddress(application.applicationsMailingAddress)} />
          </FieldValue>
        )}

        {application.applicant.workInRegion === "yes" && (
          <FieldValue
            testId={"app-summary-applicant-work-address"}
            id="applicantWorkAddress"
            label={t("application.contact.workAddress")}
            className={"pb-4"}
          >
            <MultiLineAddress
              address={reformatAddress(application.applicant.applicantWorkAddress)}
            />
          </FieldValue>
        )}

        {application.contactPreferences && (
          <FieldValue
            testId={"app-summary-contact-preference-type"}
            id="applicantPreferredContactType"
            label={t("application.contact.preferredContactType")}
            className={"pb-4"}
          >
            {application.contactPreferences?.map((item) => t(`t.${item}`)).join(", ")}
          </FieldValue>
        )}
      </div>

      {application.alternateContact.type !== "" &&
        application.alternateContact.type !== "noContact" && (
          <div id="alternateContact">
            <h3 className="form--card__sub-header border-none text-xl">
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
                testId={"app-summary-alternate-name"}
                id="alternateName"
                label={t("t.name")}
                helpText={alternateContactName()}
                className={"pb-4"}
              >
                {application.alternateContact.firstName} {application.alternateContact.lastName}
              </FieldValue>

              {application.alternateContact.emailAddress && (
                <FieldValue
                  testId={"app-summary-alternate-email"}
                  id="alternateEmail"
                  label={t("t.email")}
                  className={"pb-4"}
                >
                  {application.alternateContact.emailAddress}
                </FieldValue>
              )}

              {application.alternateContact.phoneNumber && (
                <FieldValue
                  testId={"app-summary-alternate-phone"}
                  id="alternatePhone"
                  label={t("t.phone")}
                  className={"pb-4"}
                >
                  {application.alternateContact.phoneNumber}
                </FieldValue>
              )}

              {Object.values(application.alternateContact.address).some(
                (value) => value !== ""
              ) && (
                <FieldValue
                  testId={"app-summary-alternate-mailing-address"}
                  id="alternateMailingAddress"
                  label={t("application.contact.address")}
                  className={"pb-4"}
                >
                  <MultiLineAddress address={application.alternateContact.address} />
                </FieldValue>
              )}
            </div>
          </div>
        )}

      {application.householdSize > 1 && (
        <div id="householdMembers">
          <h3 className="form--card__sub-header border-none text-xl">
            {t("application.household.householdMembers")}
            {editMode && !validationError && (
              <EditLink href="/applications/household/add-members" />
            )}
          </h3>

          <div id="members" className="form-card__group info-group mx-0">
            {application.householdMember.map((member, index) => (
              <div
                className="info-group__item"
                key={`${member.firstName} - ${member.lastName} - ${index}`}
              >
                <FieldValue
                  label={t("t.name")}
                  testId={"app-summary-household-member-name"}
                  className={"pb-4"}
                >
                  {member.firstName} {member.lastName}
                </FieldValue>
                <FieldValue
                  testId={"app-summary-household-member-dob"}
                  label={t("application.household.member.dateOfBirth")}
                  className={"pb-4"}
                >
                  {member.birthMonth}/{member.birthDay}/{member.birthYear}
                </FieldValue>
                {member.sameAddress === "no" && (
                  <FieldValue
                    label={t("application.contact.address")}
                    className={"pb-4"}
                    testId={"app-summary-household-member-address"}
                  >
                    <MultiLineAddress
                      data-testid={"app-summary-household-member-address"}
                      address={reformatAddress(member.householdMemberAddress)}
                    />
                  </FieldValue>
                )}
                {member.sameAddress !== "no" && (
                  <p
                    data-testid={"app-summary-household-member-same-address"}
                    className={"text-xs text-gray-750"}
                  >
                    {t("application.review.sameAddressAsApplicant")}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div id="householdDetails">
        <h3 className="form--card__sub-header border-none text-xl">
          {t("application.review.householdDetails")}
          {editMode && !validationError && (
            <EditLink href="/applications/household/preferred-units" />
          )}
        </h3>

        <div className="form-card__group mx-0">
          {preferredUnits && (
            <FieldValue
              testId={"app-summary-preferred-units"}
              id="householdUnitType"
              label={t("application.household.preferredUnit.preferredUnitType")}
              className={"pb-4"}
            >
              {preferredUnits
                ?.map((item) => t(`application.household.preferredUnit.options.${item}`))
                .join(", ")}
            </FieldValue>
          )}
          <FieldValue
            testId={"app-summary-ada"}
            id="householdAda"
            label={t("application.ada.label")}
            className={"pb-4"}
          >
            {accessibilityLabels(application.accessibility).map((item) => (
              <div key={item} data-testid={item}>
                {item}
                <br />
              </div>
            ))}
          </FieldValue>
          <FieldValue
            testId={"app-summary-household-changes"}
            id="householdChanges"
            label={t("application.household.expectingChanges.title")}
            className={"pb-4"}
          >
            {application.householdExpectingChanges ? t("t.yes") : t("t.no")}
          </FieldValue>
          <FieldValue
            testId={"app-summary-household-student"}
            id="householdStudent"
            label={t("application.household.householdStudent.title")}
            className={"pb-4"}
          >
            {application.householdStudent ? t("t.yes") : t("t.no")}
          </FieldValue>
        </div>

        {!hidePrograms &&
          multiselectQuestionSection(
            MultiselectQuestionsApplicationSectionEnum.programs,
            "/applications/programs/programs",
            t("t.programs"),
            application.programs.filter((item) => item.claimed == true).length == 0
              ? `${t("application.preferences.general.title", {
                  county: listing?.listingsBuildingAddress?.county || listing?.jurisdictions?.name,
                })} ${t("application.preferences.general.preamble")}`
              : null
          )}

        <h3 className="form--card__sub-header border-none text-xl">
          {t("t.income")}
          {editMode && !validationError && <EditLink href="/applications/financial/vouchers" />}
        </h3>

        <div className={`form-card__group mx-0 ${hidePreferences && "border-b"}`}>
          <FieldValue
            testId={"app-summary-income-vouchers"}
            id="incomeVouchers"
            label={t("application.review.voucherOrSubsidy")}
            className={"pb-4"}
          >
            {application.incomeVouchers ? t("t.yes") : t("t.no")}
          </FieldValue>

          {application.incomePeriod && (
            <FieldValue
              testId={"app-summary-income"}
              id="incomeValue"
              label={t("t.income")}
              className={"pb-4"}
            >
              $
              {parseFloat(application.income).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              {t(`t.${application.incomePeriod}`)}
            </FieldValue>
          )}
        </div>

        {!hidePreferences &&
          multiselectQuestionSection(
            MultiselectQuestionsApplicationSectionEnum.preferences,
            "/applications/preferences/all",
            t("t.preferences"),
            application.preferences.filter((item) => item.claimed == true).length == 0
              ? `${t("application.preferences.general.title", {
                  county: listing?.listingsBuildingAddress?.county || listing?.jurisdictions?.name,
                })} ${t("application.preferences.general.preamble")}`
              : null,
            "border-b"
          )}
      </div>
    </>
  )
}

export default FormSummaryDetails
