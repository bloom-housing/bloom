import React, { useContext } from "react"
import { t, GridSection, GridCell } from "@bloom-housing/ui-components"
import { FieldValue } from "@bloom-housing/ui-seeds"
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
          <FieldValue label={t("application.name.firstName")} testId="alternateContact.firstName">
            {application.alternateContact.firstName || t("t.n/a")}
          </FieldValue>
        </GridCell>

        <GridCell>
          <FieldValue label={t("application.name.lastName")} testId="alternateContact.lastName">
            {application.alternateContact.lastName || t("t.n/a")}
          </FieldValue>
        </GridCell>

        <GridCell>
          <FieldValue label={t("t.relationship")} testId="relationship">
            {(() => {
              if (!application.alternateContact.type) return t("t.n/a")

              if (application.alternateContact.otherType)
                return application.alternateContact.otherType

              return t(
                `application.alternateContact.type.options.${application.alternateContact.type}`
              )
            })()}
          </FieldValue>
        </GridCell>

        {
          <GridCell>
            <FieldValue label={t("application.details.agency")} testId="alternateContact.agency">
              {application.alternateContact.agency || t("t.n/a")}
            </FieldValue>
          </GridCell>
        }

        <GridCell>
          <FieldValue label={t("t.email")} testId="alternateContact.emailAddress">
            {application.alternateContact.emailAddress || t("t.n/a")}
          </FieldValue>
        </GridCell>

        <GridCell>
          <FieldValue label={t("t.phone")} testId="alternateContact.phoneNumber">
            {application.alternateContact.phoneNumber || t("t.n/a")}
          </FieldValue>
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
