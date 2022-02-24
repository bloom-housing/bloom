import React, { useContext, useMemo } from "react"
import { t, GridSection, ViewItem, GridCell } from "@bloom-housing/ui-components"
import { ApplicationContext } from "../../ApplicationContext"
import { convertDataToPst } from "../../../../lib/helpers"
import { ApplicationSubmissionType } from "@bloom-housing/backend-core/types"

const DetailsApplicationData = () => {
  const application = useContext(ApplicationContext)

  const applicationDate = useMemo(() => {
    if (!application) return null

    return convertDataToPst(
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
        <ViewItem label={t("application.details.number")}>
          {application.confirmationCode || application.id}
        </ViewItem>
      </GridCell>

      {application.submissionType && (
        <GridCell>
          <ViewItem label={t("application.details.type")}>
            {t(`application.details.submissionType.${application.submissionType}`)}
          </ViewItem>
        </GridCell>
      )}

      <GridCell>
        <ViewItem label={t("application.details.submittedDate")}>{applicationDate.date}</ViewItem>
      </GridCell>

      <GridCell>
        <ViewItem label={t("application.details.timeDate")}>{applicationDate.time}</ViewItem>
      </GridCell>

      <GridCell>
        <ViewItem label={t("application.details.language")}>
          {application.language ? t(`languages.${application.language}`) : t("t.n/a")}
        </ViewItem>
      </GridCell>

      <GridCell>
        <ViewItem label={t("application.details.totalSize")}>
          {!application.householdSize ? 1 : application.householdSize}
        </ViewItem>
      </GridCell>

      <GridCell>
        <ViewItem label={t("application.details.submittedBy")}>
          {application.applicant.firstName && application.applicant.lastName
            ? `${application.applicant.firstName} ${application.applicant.lastName}`
            : t("t.n/a")}
        </ViewItem>
      </GridCell>
    </GridSection>
  )
}

export { DetailsApplicationData as default, DetailsApplicationData }
