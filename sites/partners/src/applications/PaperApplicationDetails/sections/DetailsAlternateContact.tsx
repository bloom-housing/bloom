import React, { useContext } from "react"
import { t, GridSection, ViewItem, GridCell } from "@bloom-housing/ui-components"
import { ApplicationContext } from "../../ApplicationContext"
import { DetailsAddressColumns, AddressColsType } from "../DetailsAddressColumns"

const DetailsAlternateContact = () => {
  const application = useContext(ApplicationContext)

  return (
    <GridSection
      className="bg-primary-lighter"
      title={t("application.alternateContact.type.label")}
      inset
      grid={false}
    >
      <GridSection columns={3}>
        <GridCell>
          <ViewItem label={t("application.name.firstName")} dataTestId="alternateContact.firstName">
            {application.alternateContact.firstName || t("t.n/a")}
          </ViewItem>
        </GridCell>

        <GridCell>
          <ViewItem label={t("application.name.lastName")} dataTestId="alternateContact.lastName">
            {application.alternateContact.lastName || t("t.n/a")}
          </ViewItem>
        </GridCell>

        <GridCell>
          <ViewItem label={t("t.relationship")} dataTestId="relationship">
            {(() => {
              if (!application.alternateContact.type) return t("t.n/a")

              if (application.alternateContact.otherType)
                return application.alternateContact.otherType

              return t(
                `application.alternateContact.type.options.${application.alternateContact.type}`
              )
            })()}
          </ViewItem>
        </GridCell>

        {
          <GridCell>
            <ViewItem label={t("application.details.agency")} dataTestId="alternateContact.agency">
              {application.alternateContact.agency || t("t.n/a")}
            </ViewItem>
          </GridCell>
        }

        <GridCell>
          <ViewItem label={t("t.email")} dataTestId="alternateContact.emailAddress">
            {application.alternateContact.emailAddress || t("t.n/a")}
          </ViewItem>
        </GridCell>

        <GridCell>
          <ViewItem label={t("t.phone")} dataTestId="alternateContact.phoneNumber">
            {application.alternateContact.phoneNumber || t("t.n/a")}
          </ViewItem>
        </GridCell>
      </GridSection>

      <GridSection subtitle={t("application.contact.address")} columns={3}>
        <DetailsAddressColumns
          type={AddressColsType.alternateAddress}
          application={application}
          dataTestId="alternateContact"
        />
      </GridSection>
    </GridSection>
  )
}

export { DetailsAlternateContact as default, DetailsAlternateContact }
