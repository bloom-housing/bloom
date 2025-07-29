import React, { useEffect, useState } from "react"
import { MultiLineAddress, t } from "@bloom-housing/ui-components"
import { Card, FieldValue, Heading, Link } from "@bloom-housing/ui-seeds"
import {
  getUniqueUnitTypes,
  getUniqueUnitGroupUnitTypes,
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
import styles from "./FormSummaryDetails.module.scss"

type FormSummaryDetailsProps = {
  application: Application
  listing: Listing
  editMode?: boolean
  hidePreferences?: boolean
  hidePrograms?: boolean
  validationError?: boolean
  enableUnitGroups?: boolean
  enableFullTimeStudentQuestion?: boolean
  enableAdaOtherOption?: boolean
}

const FormSummaryDetails = ({
  application,
  listing,
  editMode = false,
  hidePreferences = false,
  hidePrograms = false,
  validationError = false,
  enableUnitGroups = false,
  enableAdaOtherOption = false,
  enableFullTimeStudentQuestion = false,
}: FormSummaryDetailsProps) => {
  // fix for rehydration
  const [hasMounted, setHasMounted] = useState(false)
  useEffect(() => {
    setHasMounted(true)
  }, [])
  if (!hasMounted) {
    return null
  }

  const accessibilityLabels = () => {
    const labels = []
    if (application.accessibility.mobility) labels.push(t("application.ada.mobility"))
    if (application.accessibility.vision) labels.push(t("application.ada.vision"))
    if (application.accessibility.hearing) labels.push(t("application.ada.hearing"))
    if (application.accessibility.other && enableAdaOtherOption)
      labels.push(t("application.ada.other"))
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

  const alternateContactName = () => {
    switch (application.alternateContact.type) {
      case "other":
        return application.alternateContact.otherType
      case "caseManager":
        return application.alternateContact.agency
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
    divider?: boolean
  ) => {
    return (
      <>
        <Card.Header className={styles["summary-header"]}>
          <Heading priority={3} size="xl">
            {header}
          </Heading>
          {editMode && !validationError && <Link href={appLink}>{t("t.edit")}</Link>}
        </Card.Header>

        <Card.Section
          className={styles["summary-section"]}
          id={applicationSection}
          divider={divider ? "flush" : undefined}
        >
          {emptyText ? (
            <p className={styles["summary-note-text"]}>{emptyText}</p>
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
        </Card.Section>
      </>
    )
  }

  const allListingUnitTypes = enableUnitGroups
    ? getUniqueUnitGroupUnitTypes(listing?.unitGroups)
    : getUniqueUnitTypes(listing?.units)

  const preferredUnits = application.preferredUnitTypes?.map((unit) => {
    const unitDetails = allListingUnitTypes?.find(
      (unitType) => unitType.name === unit.name || unit.id === unitType.id
    )
    return unitDetails?.name || unit.name
  })

  return (
    <>
      <Card.Header className={styles["summary-header"]}>
        <Heading priority={3} size="xl">
          {t("t.you")}
        </Heading>
        {editMode && <Link href="/applications/contact/name">{t("t.edit")}</Link>}
      </Card.Header>

      <Card.Section className={styles["summary-section"]}>
        <FieldValue
          testId={"app-summary-applicant-name"}
          id="applicantName"
          label={t("t.name")}
          className={styles["summary-value"]}
        >
          {`${application.applicant.firstName}${
            application.applicant.middleName ? ` ${application.applicant.middleName}` : ``
          } ${application.applicant.lastName}`}
        </FieldValue>
        <FieldValue
          testId={"app-summary-applicant-dob"}
          id="applicantbirthDay"
          label={t("application.household.member.dateOfBirth")}
          className={styles["summary-value"]}
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
            className={styles["summary-value"]}
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
            className={styles["summary-value"]}
          >
            {application.additionalPhoneNumber}
          </FieldValue>
        )}
        {application.applicant.emailAddress && (
          <FieldValue
            testId={"app-summary-applicant-email"}
            id="applicantEmail"
            label={t("t.email")}
            className={styles["summary-value"]}
          >
            {application.applicant.emailAddress}
          </FieldValue>
        )}
        <FieldValue
          testId={"app-summary-applicant-address"}
          id="applicantAddress"
          label={t("application.contact.address")}
          className={styles["summary-value"]}
        >
          <MultiLineAddress address={reformatAddress(application.applicant.applicantAddress)} />
        </FieldValue>
        {application.sendMailToMailingAddress && (
          <FieldValue
            testId={"app-summary-applicant-mailing-address"}
            id="applicantMailingAddress"
            label={t("application.contact.mailingAddress")}
            className={styles["summary-value"]}
          >
            <MultiLineAddress address={reformatAddress(application.applicationsMailingAddress)} />
          </FieldValue>
        )}
        {enableFullTimeStudentQuestion && (
          <FieldValue
            testId={"app-summary-full-time-student"}
            id="fullTimeStudent"
            label={t("application.review.confirmation.fullTimeStudent")}
            className={styles["summary-value"]}
          >
            {application.applicant.fullTimeStudent
              ? t(`t.${application.applicant.fullTimeStudent}`)
              : t("t.n/a")}
          </FieldValue>
        )}
      </Card.Section>
      {application.alternateContact.type && application.alternateContact.type !== "noContact" && (
        <>
          <Card.Header className={styles["summary-header"]}>
            <Heading priority={3} size="xl">
              {t("application.alternateContact.type.label")}
            </Heading>
            {editMode && !validationError && (
              <Link href="/applications/contact/alternate-contact-type">{t("t.edit")}</Link>
            )}
          </Card.Header>

          <Card.Section className={styles["summary-section"]}>
            <p className={styles["summary-note-text"]}>
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

            {Object.values(application.alternateContact.address).some((value) => value !== "") && (
              <FieldValue
                testId={"app-summary-alternate-mailing-address"}
                id="alternateMailingAddress"
                label={t("application.contact.address")}
                className={"pb-4"}
              >
                <MultiLineAddress address={application.alternateContact.address} />
              </FieldValue>
            )}
          </Card.Section>
        </>
      )}

      {application.householdSize > 1 && (
        <>
          <Card.Header className={styles["summary-header"]}>
            <Heading priority={3} size="xl">
              {t("application.household.householdMembers")}
            </Heading>
            {editMode && !validationError && (
              <Link href="/applications/household/add-members">{t("t.edit")}</Link>
            )}
          </Card.Header>

          <Card.Section className={styles["summary-section"]}>
            {application.householdMember.map((member, index) => (
              <div
                className={styles["household-member-section"]}
                key={`${member.firstName} - ${member.lastName} - ${index}`}
              >
                <FieldValue
                  label={t("t.name")}
                  testId={"app-summary-household-member-name"}
                  className={styles["summary-value"]}
                >
                  {member.firstName} {member.lastName}
                </FieldValue>
                <FieldValue
                  testId={"app-summary-household-member-dob"}
                  label={t("application.household.member.dateOfBirth")}
                  className={styles["summary-value"]}
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
                    className={styles["household-member-same-address"]}
                  >
                    {t("application.review.sameAddressAsApplicant")}
                  </p>
                )}
                {enableFullTimeStudentQuestion && (
                  <FieldValue
                    testId={"app-summary-household-member-full-time-student"}
                    label={t("application.review.confirmation.fullTimeStudent")}
                    className={styles["summary-value"]}
                  >
                    {member.fullTimeStudent ? t(`t.${member.fullTimeStudent}`) : t("t.n/a")}
                  </FieldValue>
                )}
              </div>
            ))}
          </Card.Section>
        </>
      )}

      <>
        <Card.Header className={styles["summary-header"]}>
          <Heading priority={3} size="xl">
            {t("application.review.householdDetails")}
          </Heading>
          {editMode && !validationError && (
            <Link href="/applications/household/preferred-units">{t("t.edit")}</Link>
          )}
        </Card.Header>

        <Card.Section className={styles["summary-section"]}>
          {preferredUnits?.length > 0 && (
            <FieldValue
              testId={"app-summary-preferred-units"}
              id="householdUnitType"
              label={t("application.household.preferredUnit.preferredUnitType")}
              className={styles["summary-value"]}
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
            className={styles["summary-value"]}
          >
            {accessibilityLabels().map((item) => (
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
            className={styles["summary-value"]}
          >
            {application.householdExpectingChanges ? t("t.yes") : t("t.no")}
          </FieldValue>
          <FieldValue
            testId={"app-summary-household-student"}
            id="householdStudent"
            label={
              enableFullTimeStudentQuestion
                ? t("application.household.householdStudentAll.title")
                : t("application.household.householdStudent.title")
            }
            className={styles["summary-value"]}
          >
            {application.householdStudent ? t("t.yes") : t("t.no")}
          </FieldValue>
        </Card.Section>

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

        <Card.Header className={styles["summary-header"]}>
          <Heading priority={3} size="xl">
            {t("t.income")}
          </Heading>
          {editMode && !validationError && (
            <Link href="/applications/financial/vouchers">{t("t.edit")}</Link>
          )}
        </Card.Header>

        <Card.Section
          className={styles["summary-section"]}
          divider={hidePreferences ? "flush" : undefined}
        >
          <FieldValue
            testId={"app-summary-income-vouchers"}
            id="incomeVouchers"
            label={t("application.review.voucherOrSubsidy")}
            className={styles["summary-value"]}
          >
            {application.incomeVouchers?.some((item) => item === "none") ? t("t.no") : t("t.yes")}
          </FieldValue>

          {application.incomePeriod && (
            <FieldValue
              testId={"app-summary-income"}
              id="incomeValue"
              label={t("t.income")}
              className={styles["summary-value"]}
            >
              $
              {parseFloat(application.income).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              {t(`t.${application.incomePeriod}`)}
            </FieldValue>
          )}
        </Card.Section>

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
            true
          )}
      </>
    </>
  )
}

export default FormSummaryDetails
