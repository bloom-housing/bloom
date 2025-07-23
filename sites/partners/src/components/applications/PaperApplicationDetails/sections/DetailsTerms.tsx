import React, { useContext } from "react"
import { t } from "@bloom-housing/ui-components"
import { FieldValue, Grid } from "@bloom-housing/ui-seeds"
import { ApplicationContext } from "../../ApplicationContext"
import SectionWithGrid from "../../../shared/SectionWithGrid"

const DetailsTerms = () => {
  const application = useContext(ApplicationContext)

  return (
    <SectionWithGrid heading={t("application.review.terms.title")} inset>
      <Grid.Row>
        <Grid.Cell>
          <FieldValue label={t("application.details.signatureOnTerms")} testId="signatureOnTerms">
            {(() => {
              if (application.acceptedTerms === null) {
                return t("t.n/a")
              } else if (application.acceptedTerms) {
                return t("t.yes")
              } else {
                return t("t.no")
              }
            })()}
          </FieldValue>
        </Grid.Cell>
      </Grid.Row>
    </SectionWithGrid>
  )
}

export { DetailsTerms as default, DetailsTerms }
