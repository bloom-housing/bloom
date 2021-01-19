import React, { useContext } from "react"
import { t, GridSection, ViewItem, GridCell } from "@bloom-housing/ui-components"
import { DetailsApplicationContext } from "../DetailsApplicationContext"
import { DetailsAddressColumns, AddressColsType } from "../DetailsAddressColumns"

const DetailsPrimaryApplicant = () => {
  const application = useContext(DetailsApplicationContext)

  return (
    <GridSection
      className="bg-primary-lighter"
      title={t("application.household.primaryApplicant")}
      inset
      grid={false}
    >
      <GridSection columns={3}>
        <GridCell>
          <ViewItem label={t("application.name.firstName")}>
            {application.applicant.firstName || t("t.n/a")}
          </ViewItem>
        </GridCell>

        <GridCell>
          <ViewItem label={t("application.name.middleName")}>
            {application.applicant.middleName || t("t.n/a")}
          </ViewItem>
        </GridCell>

        <GridCell>
          <ViewItem label={t("application.name.lastName")}>
            {application.applicant.lastName || t("t.n/a")}
          </ViewItem>
        </GridCell>

        <GridCell>
          <ViewItem label={t("application.household.member.dateOfBirth")}>
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
          <ViewItem label={t("t.email")} truncated>
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
          >
            {application.additionalPhoneNumber || t("t.n/a")}
          </ViewItem>
        </GridCell>

        <GridCell>
          <ViewItem label={t("application.details.preferredContact")}>
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
          <ViewItem label={t("application.details.workInRegion")}>
            {(() => {
              if (!application.applicant.workInRegion) return t("t.n/a")

              return application.applicant.workInRegion === "yes" ? t("t.yes") : t("t.no")
            })()}
          </ViewItem>
        </GridCell>
      </GridSection>

      <GridSection subtitle={t("application.details.residenceAddress")} columns={3}>
        <DetailsAddressColumns type={AddressColsType.residence} application={application} />
      </GridSection>

      <GridSection subtitle={t("application.contact.mailingAddress")} columns={3}>
        <DetailsAddressColumns type={AddressColsType.mailing} application={application} />
      </GridSection>

      <GridSection subtitle={t("application.contact.workAddress")} columns={3}>
        <DetailsAddressColumns type={AddressColsType.work} application={application} />
      </GridSection>
    </GridSection>
  )
}

export { DetailsPrimaryApplicant as default, DetailsPrimaryApplicant }
