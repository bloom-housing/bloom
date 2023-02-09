import React, { useContext } from "react"
import { t, GridSection, GridCell } from "@bloom-housing/ui-components"
import { ViewItem } from "../../../../../../detroit-ui-components/src/blocks/ViewItem"
import { ApplicationContext } from "../../ApplicationContext"
import { DetailsAddressColumns, AddressColsType } from "../DetailsAddressColumns"
import { YesNoAnswer } from "../../PaperApplicationForm/FormTypes"

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
          <ViewItem label={t("application.name.firstName")} dataTestId="firstName">
            {application.applicant.firstName || t("t.n/a")}
          </ViewItem>
        </GridCell>

        <GridCell>
          <ViewItem label={t("application.name.middleName")} dataTestId="middleName">
            {application.applicant.middleName || t("t.n/a")}
          </ViewItem>
        </GridCell>

        <GridCell>
          <ViewItem label={t("application.name.lastName")} dataTestId="lastName">
            {application.applicant.lastName || t("t.n/a")}
          </ViewItem>
        </GridCell>

        <GridCell>
          <ViewItem label={t("application.household.member.dateOfBirth")} dataTestId="dateOfBirth">
            {(() => {
              const { birthMonth, birthDay, birthYear } = application?.applicant

              if (birthMonth && birthDay && birthYear) {
                return `${birthMonth}/${birthDay}/${birthYear}`
              }

              return t("t.n/a")
            })()}
          </ViewItem>
        </GridCell>

        <GridCell>
          <ViewItem label={t("t.email")} truncated dataTestId="emailAddress">
            {application.applicant.emailAddress || t("t.n/a")}
          </ViewItem>
        </GridCell>

        <GridCell>
          <ViewItem
            label={t("t.phone")}
            helper={
              application.applicant.phoneNumberType &&
              t(`application.contact.phoneNumberTypes.${application.applicant.phoneNumberType}`)
            }
            dataTestId="phoneNumber"
          >
            {application.applicant.phoneNumber || t("t.n/a")}
          </ViewItem>
        </GridCell>

        <GridCell>
          <ViewItem
            label={t("t.secondPhone")}
            helper={
              application.additionalPhoneNumber &&
              t(`application.contact.phoneNumberTypes.${application.additionalPhoneNumberType}`)
            }
            dataTestId="additionalPhoneNumber"
          >
            {application.additionalPhoneNumber || t("t.n/a")}
          </ViewItem>
        </GridCell>

        <GridCell>
          <ViewItem label={t("application.details.preferredContact")} dataTestId="preferredContact">
            {(() => {
              if (!application.contactPreferences.length) return t("t.n/a")

              return application.contactPreferences.map((item) => (
                <span key={item}>
                  {t(`t.${item}`)}
                  <br />
                </span>
              ))
            })()}
          </ViewItem>
        </GridCell>

        <GridCell>
          <ViewItem label={t("application.details.workInRegion")} dataTestId="workInRegion">
            {(() => {
              if (!application.applicant.workInRegion) return t("t.n/a")

              return application.applicant.workInRegion === YesNoAnswer.Yes ? t("t.yes") : t("t.no")
            })()}
          </ViewItem>
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
