import React, { useContext, useMemo } from "react"
import { t } from "@bloom-housing/ui-components"
import { FieldValue, Grid } from "@bloom-housing/ui-seeds"
import { ApplicationContext } from "../../ApplicationContext"
import { convertDataToLocal } from "../../../../lib/helpers"
import SectionWithGrid from "../../../shared/SectionWithGrid"

const DetailsApplicationData = () => {
  const application = useContext(ApplicationContext)

  const applicationDate = useMemo(() => {
    if (!application) return null

    return convertDataToLocal(application?.submissionDate)
  }, [application])

  return (
    <SectionWithGrid heading={t("application.details.applicationData")} inset>
      <Grid.Row>
        <Grid.Cell>
          <FieldValue label={t("application.details.number")} testId="number">
            {application.confirmationCode ?? t("t.n/a")}
          </FieldValue>
        </Grid.Cell>

        {application.submissionType && (
          <Grid.Cell>
            <FieldValue label={t("application.details.type")} testId="type">
              {t(`application.details.submissionType.${application.submissionType}`)}
            </FieldValue>
          </Grid.Cell>
        )}

        <Grid.Cell>
          <FieldValue label={t("application.details.submittedDate")} testId="submittedDate">
            {applicationDate.date}
          </FieldValue>
        </Grid.Cell>
      </Grid.Row>

      <Grid.Row>
        <Grid.Cell>
          <FieldValue label={t("application.details.timeDate")} testId="timeDate">
            {applicationDate.time}
          </FieldValue>
        </Grid.Cell>

        <Grid.Cell>
          <FieldValue label={t("application.details.language")} testId="language">
            {application.language ? t(`languages.${application.language}`) : t("t.n/a")}
          </FieldValue>
        </Grid.Cell>

        <Grid.Cell>
          <FieldValue label={t("application.details.totalSize")} testId="totalSize">
            {!application.householdSize ? 1 : application.householdSize}
          </FieldValue>
        </Grid.Cell>
      </Grid.Row>

      <Grid.Row>
        <Grid.Cell>
          <FieldValue label={t("application.details.submittedBy")} testId="submittedBy">
            {application.applicant.firstName && application.applicant.lastName
              ? `${application.applicant.firstName} ${application.applicant.lastName}`
              : t("t.n/a")}
          </FieldValue>
        </Grid.Cell>
      </Grid.Row>
    </SectionWithGrid>
  )
}

export { DetailsApplicationData as default, DetailsApplicationData }
