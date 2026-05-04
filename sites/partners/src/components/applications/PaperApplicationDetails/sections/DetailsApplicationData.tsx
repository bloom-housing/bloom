import React, { useContext, useMemo } from "react"
import { t } from "@bloom-housing/ui-components"
import { FieldValue, Grid } from "@bloom-housing/ui-seeds"
import { ApplicationContext } from "../../ApplicationContext"
import { convertDataToLocal } from "../../../../lib/helpers"
import SectionWithGrid from "../../../shared/SectionWithGrid"
import {
  ApplicationStatusEnum,
  ApplicationSubmissionTypeEnum,
  ReviewOrderTypeEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"

type DetailsApplicationDataProps = {
  enableApplicationStatus?: boolean
  enableReceivedAtAndByFields?: boolean
  reviewOrderType?: ReviewOrderTypeEnum
}

const DetailsApplicationData = ({
  enableApplicationStatus,
  enableReceivedAtAndByFields,
  reviewOrderType,
}: DetailsApplicationDataProps) => {
  const application = useContext(ApplicationContext)

  const applicationDate = useMemo(() => {
    if (!application) return null

    return convertDataToLocal(application?.submissionDate)
  }, [application])

  const receivedDate = useMemo(() => {
    if (!application) return null

    return convertDataToLocal(application?.receivedAt)
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

      {enableReceivedAtAndByFields &&
        application.submissionType === ApplicationSubmissionTypeEnum.paper && (
          <Grid.Row>
            <Grid.Cell>
              <FieldValue label={t("application.details.receivedDate")} testId="receivedDate">
                {receivedDate?.date}
              </FieldValue>
            </Grid.Cell>

            <Grid.Cell>
              <FieldValue label={t("application.details.receivedTime")} testId="receivedTime">
                {receivedDate?.time}
              </FieldValue>
            </Grid.Cell>

            <Grid.Cell>
              <FieldValue label={t("application.details.receivedBy")} testId="receivedBy">
                {application.receivedBy ? application.receivedBy : t("t.n/a")}
              </FieldValue>
            </Grid.Cell>
          </Grid.Row>
        )}

      <Grid.Row>
        <Grid.Cell>
          <FieldValue label={t("application.details.submittedBy")} testId="submittedBy">
            {application.applicant.firstName && application.applicant.lastName
              ? `${application.applicant.firstName} ${application.applicant.lastName}`
              : t("t.n/a")}
          </FieldValue>
        </Grid.Cell>
      </Grid.Row>
      {enableApplicationStatus && (
        <>
          {application.status === ApplicationStatusEnum.declined && (
            <Grid.Row columns={3}>
              <Grid.Cell>
                <FieldValue label={t("application.details.applicationDeclineReason")}>
                  {application.applicationDeclineReason
                    ? t(
                        `application.details.applicationDeclineReason.${application.applicationDeclineReason}`
                      )
                    : t("t.n/a")}
                </FieldValue>
              </Grid.Cell>
              <Grid.Cell className={"seeds-grid-span-2"}>
                <FieldValue
                  label={t("application.details.applicationDeclineReasonAdditionalDetails")}
                >
                  {application.applicationDeclineReasonAdditionalDetails ?? t("t.n/a")}
                </FieldValue>
              </Grid.Cell>
            </Grid.Row>
          )}
          <Grid.Row columns={3}>
            <Grid.Cell>
              <FieldValue label={t("application.details.accessibleUnitWaitlistNumber")}>
                {application.accessibleUnitWaitlistNumber ?? t("t.n/a")}
              </FieldValue>
            </Grid.Cell>
            <Grid.Cell>
              <FieldValue label={t("application.details.conventionalUnitWaitlistNumber")}>
                {application.conventionalUnitWaitlistNumber ?? t("t.n/a")}
              </FieldValue>
            </Grid.Cell>
            <Grid.Cell>
              {reviewOrderType === ReviewOrderTypeEnum.lottery && (
                <FieldValue label={t("application.details.manualLotteryPositionNumber")}>
                  {application.manualLotteryPositionNumber ?? t("t.n/a")}
                </FieldValue>
              )}
            </Grid.Cell>
          </Grid.Row>
        </>
      )}
    </SectionWithGrid>
  )
}

export { DetailsApplicationData as default, DetailsApplicationData }
