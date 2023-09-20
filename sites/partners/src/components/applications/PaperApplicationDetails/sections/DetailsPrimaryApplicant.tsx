import React, { useContext } from "react"
import { t, GridSection, GridCell } from "@bloom-housing/ui-components"
import { FieldValue } from "@bloom-housing/ui-seeds"
import { ApplicationContext } from "../../ApplicationContext"
import { DetailsAddressColumns, AddressColsType } from "../DetailsAddressColumns"
import { YesNoAnswer } from "../../../../lib/helpers"

const DetailsPrimaryApplicant = () => {
  const application = useContext(ApplicationContext)

  return (
    <GridSection
      className="bg-primary-lighter"
      title={t("application.household.primaryApplicant")}
      inset
      grid={false}
    >
      <GridSection columns={3}>
        <GridCell>
          <FieldValue label={t("application.name.firstName")} testId="firstName">
            {application.applicant.firstName || t("t.n/a")}
          </FieldValue>
        </GridCell>

        <GridCell>
          <FieldValue label={t("application.name.middleName")} testId="middleName">
            {application.applicant.middleName || t("t.n/a")}
          </FieldValue>
        </GridCell>

        <GridCell>
          <FieldValue label={t("application.name.lastName")} testId="lastName">
            {application.applicant.lastName || t("t.n/a")}
          </FieldValue>
        </GridCell>

        <GridCell>
          <FieldValue label={t("application.household.member.dateOfBirth")} testId="dateOfBirth">
            {(() => {
              const applicant = application?.applicant

              if (applicant.birthMonth && applicant.birthDay && applicant.birthYear) {
                return `${applicant.birthMonth}/${applicant.birthDay}/${applicant.birthYear}`
              }

              return t("t.n/a")
            })()}
          </FieldValue>
        </GridCell>

        <GridCell>
          <FieldValue label={t("t.email")} testId="emailAddress">
            {application.applicant.emailAddress || t("t.n/a")}
          </FieldValue>
        </GridCell>

        <GridCell>
          <FieldValue
            label={t("t.phone")}
            helpText={
              application.applicant.phoneNumberType &&
              t(`application.contact.phoneNumberTypes.${application.applicant.phoneNumberType}`)
            }
            testId="phoneNumber"
          >
            {application.applicant.phoneNumber || t("t.n/a")}
          </FieldValue>
        </GridCell>

        <GridCell>
          <FieldValue
            label={t("t.secondPhone")}
            helpText={
              application.additionalPhoneNumber &&
              t(`application.contact.phoneNumberTypes.${application.additionalPhoneNumberType}`)
            }
            testId="additionalPhoneNumber"
          >
            {application.additionalPhoneNumber || t("t.n/a")}
          </FieldValue>
        </GridCell>

        <GridCell>
          <FieldValue label={t("application.details.preferredContact")} testId="preferredContact">
            {(() => {
              if (!application.contactPreferences.length) return t("t.n/a")

              return application.contactPreferences.map((item) => (
                <span key={item}>
                  {t(`t.${item}`)}
                  <br />
                </span>
              ))
            })()}
          </FieldValue>
        </GridCell>

        <GridCell>
          <FieldValue label={t("application.details.workInRegion")} testId="workInRegion">
            {(() => {
              if (!application.applicant.workInRegion) return t("t.n/a")

              return application.applicant.workInRegion === YesNoAnswer.Yes ? t("t.yes") : t("t.no")
            })()}
          </FieldValue>
        </GridCell>
      </GridSection>

      <GridSection subtitle={t("application.details.residenceAddress")} columns={3}>
        <DetailsAddressColumns
          type={AddressColsType.residence}
          application={application}
          dataTestId="residenceAddress"
        />
      </GridSection>

      <GridSection subtitle={t("application.contact.mailingAddress")} columns={3}>
        <DetailsAddressColumns
          type={AddressColsType.mailing}
          application={application}
          dataTestId="mailingAddress"
        />
      </GridSection>

      <GridSection subtitle={t("application.contact.workAddress")} columns={3}>
        <DetailsAddressColumns
          type={AddressColsType.work}
          application={application}
          dataTestId="workAddress"
        />
      </GridSection>
    </GridSection>
  )
}

export { DetailsPrimaryApplicant as default, DetailsPrimaryApplicant }
