import React, { useContext, useMemo } from "react"
import { t, GridSection, GridCell } from "@bloom-housing/ui-components"
import { FieldValue } from "@bloom-housing/ui-seeds"
import { ApplicationContext } from "../../ApplicationContext"
import { convertDataToLocal } from "../../../../lib/helpers"
import { ApplicationSubmissionType } from "@bloom-housing/backend-core/types"

const DetailsApplicationData = () => {
  const application = useContext(ApplicationContext)

  const applicationDate = useMemo(() => {
    if (!application) return null

    return convertDataToLocal(
      application?.submissionDate,
      application?.submissionType || ApplicationSubmissionType.electronical
    )
  }, [application])

  return (
    <GridSection
      className="bg-primary-lighter"
      title={t("application.details.applicationData")}
      inset
    >
      <GridCell>
        <FieldValue label={t("application.details.number")} testId="number">
          {application.confirmationCode || application.id}
        </FieldValue>
      </GridCell>

      {application.submissionType && (
        <GridCell>
          <FieldValue label={t("application.details.type")} testId="type">
            {t(`application.details.submissionType.${application.submissionType}`)}
          </FieldValue>
        </GridCell>
      )}

      <GridCell>
        <FieldValue label={t("application.details.submittedDate")} testId="submittedDate">
          {applicationDate.date}
        </FieldValue>
      </GridCell>

      <GridCell>
        <FieldValue label={t("application.details.timeDate")} testId="timeDate">
          {applicationDate.time}
        </FieldValue>
      </GridCell>

      <GridCell>
        <FieldValue label={t("application.details.language")} testId="language">
          {application.language ? t(`languages.${application.language}`) : t("t.n/a")}
        </FieldValue>
      </GridCell>

      <GridCell>
        <FieldValue label={t("application.details.totalSize")} testId="totalSize">
          {!application.householdSize ? 1 : application.householdSize}
        </FieldValue>
      </GridCell>

      <GridCell>
        <FieldValue label={t("application.details.submittedBy")} testId="submittedBy">
          {application.applicant.firstName && application.applicant.lastName
            ? `${application.applicant.firstName} ${application.applicant.lastName}`
            : t("t.n/a")}
        </FieldValue>
      </GridCell>
    </GridSection>
  )
}

export { DetailsApplicationData as default, DetailsApplicationData }
