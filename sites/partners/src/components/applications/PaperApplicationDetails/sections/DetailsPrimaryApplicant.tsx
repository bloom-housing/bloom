import React, { useContext } from "react"
import { t } from "@bloom-housing/ui-components"
import { YesNoEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { FieldValue, Grid } from "@bloom-housing/ui-seeds"
import { ApplicationContext } from "../../ApplicationContext"
import { DetailsAddressColumns, AddressColsType } from "../DetailsAddressColumns"
import SectionWithGrid from "../../../shared/SectionWithGrid"

type DetailsPrimaryApplicantProps = {
  enableFullTimeStudentQuestion?: boolean
  disableWorkInRegion?: boolean
}

const DetailsPrimaryApplicant = ({
  enableFullTimeStudentQuestion,
  disableWorkInRegion,
}: DetailsPrimaryApplicantProps) => {
  const application = useContext(ApplicationContext)

  return (
    <SectionWithGrid heading={t("application.household.primaryApplicant")} inset>
      <Grid.Row>
        <Grid.Cell>
          <FieldValue label={t("application.name.firstName")} testId="firstName">
            {application.applicant.firstName || t("t.n/a")}
          </FieldValue>
        </Grid.Cell>

        <Grid.Cell>
          <FieldValue label={t("application.name.middleName")} testId="middleName">
            {application.applicant.middleName || t("t.n/a")}
          </FieldValue>
        </Grid.Cell>

        <Grid.Cell>
          <FieldValue label={t("application.name.lastName")} testId="lastName">
            {application.applicant.lastName || t("t.n/a")}
          </FieldValue>
        </Grid.Cell>
      </Grid.Row>
      <Grid.Row>
        <Grid.Cell>
          <FieldValue label={t("application.household.member.dateOfBirth")} testId="dateOfBirth">
            {(() => {
              const { birthMonth, birthDay, birthYear } = application.applicant

              if (birthMonth && birthDay && birthYear) {
                return `${birthMonth}/${birthDay}/${birthYear}`
              }

              return t("t.n/a")
            })()}
          </FieldValue>
        </Grid.Cell>

        <Grid.Cell>
          <FieldValue label={t("t.email")} testId="emailAddress">
            {application.applicant.emailAddress || t("t.n/a")}
          </FieldValue>
        </Grid.Cell>

        <Grid.Cell>
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
        </Grid.Cell>
      </Grid.Row>

      <Grid.Row>
        <Grid.Cell>
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
        </Grid.Cell>

        <Grid.Cell>
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
        </Grid.Cell>

        {!disableWorkInRegion && (
          <Grid.Cell>
            <FieldValue label={t("application.details.workInRegion")} testId="workInRegion">
              {(() => {
                if (!application.applicant.workInRegion) return t("t.n/a")

                return application.applicant.workInRegion === YesNoEnum.yes ? t("t.yes") : t("t.no")
              })()}
            </FieldValue>
          </Grid.Cell>
        )}
      </Grid.Row>

      {enableFullTimeStudentQuestion && (
        <Grid.Row>
          <Grid.Cell>
            <FieldValue label={t("application.details.fullTimeStudent")} testId="fullTimeStudent">
              {(() => {
                if (!application.applicant.fullTimeStudent) return t("t.n/a")

                return application.applicant.fullTimeStudent === YesNoEnum.yes
                  ? t("t.yes")
                  : t("t.no")
              })()}
            </FieldValue>
          </Grid.Cell>
        </Grid.Row>
      )}

      <SectionWithGrid.HeadingRow>
        {t("application.details.residenceAddress")}
      </SectionWithGrid.HeadingRow>
      <Grid.Row columns={3}>
        <DetailsAddressColumns
          type={AddressColsType.residence}
          application={application}
          dataTestId="residenceAddress"
        />
      </Grid.Row>

      <SectionWithGrid.HeadingRow>
        {t("application.contact.mailingAddress")}
      </SectionWithGrid.HeadingRow>
      <Grid.Row columns={3}>
        <DetailsAddressColumns
          type={AddressColsType.mailing}
          application={application}
          dataTestId="mailingAddress"
        />
      </Grid.Row>
    </SectionWithGrid>
  )
}

export { DetailsPrimaryApplicant as default, DetailsPrimaryApplicant }
