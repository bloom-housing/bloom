import React, { useContext } from "react"
import { t } from "@bloom-housing/ui-components"
import { FieldValue, Grid } from "@bloom-housing/ui-seeds"
import { ApplicationContext } from "../../ApplicationContext"
import { DetailsAddressColumns, AddressColsType } from "../DetailsAddressColumns"
import SectionWithGrid from "../../../shared/SectionWithGrid"
import { AlternateContactRelationship } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

const DetailsAlternateContact = () => {
  const application = useContext(ApplicationContext)

  return (
    <SectionWithGrid heading={t("application.alternateContact.type.label")} inset>
      <Grid.Row columns={3}>
        <Grid.Cell>
          <FieldValue label={t("application.name.firstName")} testId="alternateContact.firstName">
            {application.alternateContact?.firstName || t("t.n/a")}
          </FieldValue>
        </Grid.Cell>
        <Grid.Cell>
          <FieldValue label={t("application.name.lastName")} testId="alternateContact.lastName">
            {application.alternateContact?.lastName || t("t.n/a")}
          </FieldValue>
        </Grid.Cell>
        <Grid.Cell>
          <FieldValue label={t("t.relationship")} testId="relationship">
            {(() => {
              if (!application.alternateContact?.type) return t("t.n/a")

              if (application.alternateContact?.otherType)
                return application.alternateContact.otherType

              return t(
                `application.alternateContact.type.options.${application.alternateContact.type}`
              )
            })()}
          </FieldValue>
        </Grid.Cell>

        <Grid.Cell>
          <FieldValue label={t("application.details.agency")} testId="alternateContact.agency">
            {application.alternateContact?.agency || t("t.n/a")}
          </FieldValue>
        </Grid.Cell>

        <Grid.Cell>
          <FieldValue label={t("t.email")} testId="alternateContact.emailAddress">
            {application.alternateContact?.emailAddress || t("t.n/a")}
          </FieldValue>
        </Grid.Cell>

        <Grid.Cell>
          <FieldValue label={t("t.phone")} testId="alternateContact.phoneNumber">
            {application.alternateContact?.phoneNumber || t("t.n/a")}
          </FieldValue>
        </Grid.Cell>
      </Grid.Row>
      {application.alternateContact?.type !== AlternateContactRelationship.noContact && (
        <>
          <SectionWithGrid.HeadingRow>
            {t("application.contact.address")}
          </SectionWithGrid.HeadingRow>
          <Grid.Row columns={3}>
            <DetailsAddressColumns
              type={AddressColsType.alternateAddress}
              application={application}
              dataTestId="alternateContact"
            />
          </Grid.Row>
        </>
      )}
    </SectionWithGrid>
  )
}

export { DetailsAlternateContact as default, DetailsAlternateContact }
