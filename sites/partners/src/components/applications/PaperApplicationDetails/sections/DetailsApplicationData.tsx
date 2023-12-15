import React, { useContext, useMemo } from "react"
import { t } from "@bloom-housing/ui-components"
import { FieldValue, Grid } from "@bloom-housing/ui-seeds"
import { ApplicationContext } from "../../ApplicationContext"
import { convertDataToLocal } from "../../../../lib/helpers"
import { ApplicationSubmissionTypeEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import SectionWithGrid from "../../../shared/SectionWithGrid"

const DetailsApplicationData = () => {
  const application = useContext(ApplicationContext)

  const applicationDate = useMemo(() => {
    if (!application) return null

    return convertDataToLocal(
      application?.submissionDate,
      application?.submissionType || ApplicationSubmissionTypeEnum.electronical
    )
  }, [application])

  return (
    <SectionWithGrid heading={t("application.details.applicationData")} inset>
      <Grid.Row>
        <FieldValue label={t("application.details.number")} testId="number">
          {application.confirmationCode || application.id}
        </FieldValue>

        {application.submissionType && (
          <FieldValue label={t("application.details.type")} testId="type">
            {t(`application.details.submissionType.${application.submissionType}`)}
          </FieldValue>
        )}

        <FieldValue label={t("application.details.submittedDate")} testId="submittedDate">
          {applicationDate.date}
        </FieldValue>
      </Grid.Row>

      <Grid.Row>
        <FieldValue label={t("application.details.timeDate")} testId="timeDate">
          {applicationDate.time}
        </FieldValue>

        <FieldValue label={t("application.details.language")} testId="language">
          {application.language ? t(`languages.${application.language}`) : t("t.n/a")}
        </FieldValue>

        <FieldValue label={t("application.details.totalSize")} testId="totalSize">
          {!application.householdSize ? 1 : application.householdSize}
        </FieldValue>
      </Grid.Row>

      <Grid.Row>
        <FieldValue label={t("application.details.submittedBy")} testId="submittedBy">
          {application.applicant.firstName && application.applicant.lastName
            ? `${application.applicant.firstName} ${application.applicant.lastName}`
            : t("t.n/a")}
        </FieldValue>
      </Grid.Row>
    </SectionWithGrid>
  )
}

export { DetailsApplicationData as default, DetailsApplicationData }
