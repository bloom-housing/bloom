import React from "react"
import {
  t,
  Select,
  TimeField,
  DateField,
  DateFieldValues,
  Field,
  Textarea,
} from "@bloom-housing/ui-components"
import { Grid } from "@bloom-housing/ui-seeds"
import {
  LanguagesEnum,
  ApplicationDeclineReasonEnum,
  ApplicationStatusEnum,
  ApplicationSubmissionTypeEnum,
  ReviewOrderTypeEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { useFormContext } from "react-hook-form"
import SectionWithGrid from "../../../shared/SectionWithGrid"

type FormApplicationDataProps = {
  enableApplicationStatus: boolean
  enableReceivedAtAndByFields: boolean
  appType: ApplicationSubmissionTypeEnum
  disableApplicationStatusControls?: boolean
  reviewOrderType?: ReviewOrderTypeEnum
}

const FormApplicationData = ({
  enableApplicationStatus,
  enableReceivedAtAndByFields,
  appType,
  disableApplicationStatusControls = false,
  reviewOrderType,
}: FormApplicationDataProps) => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, watch, errors, setValue } = formMethods

  const dateSubmittedValue: DateFieldValues = watch("dateSubmitted")
  const isDateFilled =
    dateSubmittedValue?.day && dateSubmittedValue?.month && dateSubmittedValue?.year

  const isDateRequired =
    dateSubmittedValue?.day || dateSubmittedValue?.month || dateSubmittedValue?.year

  const dateReceivedValue: DateFieldValues = watch("dateReceived")
  const isDateReceivedFilled =
    dateReceivedValue?.day && dateReceivedValue?.month && dateReceivedValue?.year
  const isDateReceivedRequired =
    dateReceivedValue?.day && dateReceivedValue?.month && dateReceivedValue?.year

  const applicationStatus: ApplicationStatusEnum = watch("application.status")

  const accessibleUnitWaitlistNumberValue = watch("application.accessibleUnitWaitlistNumber")
  const conventionalUnitWaitlistNumberValue = watch("application.conventionalUnitWaitlistNumber")
  const manualLotteryPositionNumberValue = watch("application.manualLotteryPositionNumber")

  const isWaitlistStatus =
    applicationStatus === ApplicationStatusEnum.waitlist ||
    applicationStatus === ApplicationStatusEnum.waitlistDeclined

  const isDeclinedStatus = applicationStatus === ApplicationStatusEnum.declined

  const applicationDeclineReasonValue: string = watch("application.applicationDeclineReason")
  const showDeclineReasonDetails = isDeclinedStatus && !!applicationDeclineReasonValue

  const applicationStatusOptions = Array.from(Object.values(ApplicationStatusEnum))
  const applicationDeclineReasonOptions = Array.from(Object.values(ApplicationDeclineReasonEnum))
  return (
    <SectionWithGrid heading={t("application.details.applicationData")}>
      <Grid.Row>
        <Grid.Cell>
          <DateField
            id="dateSubmitted"
            name="dateSubmitted"
            register={register}
            error={errors?.dateSubmitted}
            watch={watch}
            setValue={setValue}
            label={t("application.add.dateSubmitted")}
            errorMessage={t("errors.dateError")}
            required={!!isDateRequired}
            labelClass={"text__caps-spaced"}
            dataTestId="dateSubmitted"
          />
        </Grid.Cell>

        <Grid.Cell>
          <TimeField
            id="timeSubmitted"
            name="timeSubmitted"
            label={t("application.add.timeSubmitted")}
            register={register}
            setValue={setValue}
            watch={watch}
            error={!!errors?.timeSubmitted}
            disabled={!isDateFilled}
            required={!!isDateFilled}
            labelClass={"text__caps-spaced"}
            dataTestId="timeSubmitted"
          />
        </Grid.Cell>

        <Grid.Cell>
          <Select
            id="application.language"
            name="application.language"
            label={t("application.add.languageSubmittedIn")}
            register={register}
            controlClassName="control"
            options={["", ...Object.values(LanguagesEnum)]}
            keyPrefix="languages"
          />
        </Grid.Cell>
      </Grid.Row>

      {enableReceivedAtAndByFields && appType !== ApplicationSubmissionTypeEnum.electronical && (
        <Grid.Row>
          <Grid.Cell>
            <DateField
              id="dateReceived"
              name="dateReceived"
              register={register}
              error={isDateReceivedRequired ? errors?.dateReceived : undefined}
              watch={watch}
              setValue={setValue}
              label={t("application.add.dateReceivedAt")}
              errorMessage={t("errors.dateError")}
              required={!!isDateReceivedRequired}
              labelClass={"text__caps-spaced"}
              dataTestId="dateReceived"
            />
          </Grid.Cell>

          <Grid.Cell>
            <TimeField
              id="timeReceived"
              name="timeReceived"
              label={t("application.add.timeReceivedAt")}
              register={register}
              setValue={setValue}
              watch={watch}
              error={!!errors?.timeReceived}
              disabled={!isDateReceivedFilled}
              required={!!isDateReceivedFilled}
              labelClass={"text__caps-spaced"}
              dataTestId="timeReceived"
            />
          </Grid.Cell>

          <Grid.Cell>
            <Field
              id="application.receivedBy"
              name="application.receivedBy"
              label={t("application.add.receivedBy")}
              placeholder={t("application.add.receivedBy")}
              register={register}
              dataTestId="receivedBy"
            />
          </Grid.Cell>
        </Grid.Row>
      )}
      {enableApplicationStatus && (
        <>
          <Grid.Row columns={3}>
            <Grid.Cell>
              {/* We need active hidden field to send value even when field is disabled */}
              <div className={disableApplicationStatusControls ? "hidden" : ""}>
                <Select
                  id="application.status"
                  name="application.status"
                  label={t("application.details.applicationStatus")}
                  register={register}
                  controlClassName="control"
                  options={applicationStatusOptions}
                  keyPrefix="application.details.applicationStatus"
                  dataTestId="applicationStatusSelect"
                />
              </div>
              {disableApplicationStatusControls && (
                <Select
                  id="application.status.display"
                  name="application.status.display"
                  label={t("application.details.applicationStatus")}
                  controlClassName="control"
                  options={applicationStatusOptions}
                  keyPrefix="application.details.applicationStatus"
                  key={`application-status-display-${applicationStatus}`}
                  defaultValue={applicationStatus}
                  disabled
                  dataTestId="applicationStatusSelectDisplay"
                />
              )}
            </Grid.Cell>
            {/* We need active hidden field to send value even when field is not visible and disabled */}
            <Grid.Cell className={isDeclinedStatus ? "" : "hidden"}>
              <div
                className={isDeclinedStatus && !disableApplicationStatusControls ? "" : "hidden"}
              >
                <Select
                  id="application.applicationDeclineReason"
                  name="application.applicationDeclineReason"
                  label={t("application.details.applicationDeclineReason")}
                  register={register}
                  controlClassName="control"
                  options={["", ...applicationDeclineReasonOptions]}
                  keyPrefix="application.details.applicationDeclineReason"
                  dataTestId="applicationDeclineReasonSelect"
                />
              </div>
              {disableApplicationStatusControls && (
                <Select
                  id="application.applicationDeclineReason.display"
                  name="application.applicationDeclineReason.display"
                  label={t("application.details.applicationDeclineReason")}
                  controlClassName="control"
                  options={["", ...applicationDeclineReasonOptions]}
                  keyPrefix="application.details.applicationDeclineReason"
                  key={`application-decline-reason-display-${applicationStatus}`}
                  defaultValue={watch("application.applicationDeclineReason")}
                  disabled
                  dataTestId="applicationDeclineReasonSelectDisplay"
                />
              )}
            </Grid.Cell>
          </Grid.Row>
          {showDeclineReasonDetails && (
            <Grid.Row columns={3}>
              <Grid.Cell className={"seeds-grid-span-2"}>
                <Textarea
                  id="application.applicationDeclineReasonAdditionalDetails"
                  name="application.applicationDeclineReasonAdditionalDetails"
                  label={t("application.details.applicationDeclineReasonAdditionalDetails")}
                  note={t("application.details.applicationDeclineReasonAdditionalDetailsNote")}
                  register={register}
                  fullWidth={true}
                  maxLength={2000}
                  placeholder={""}
                />
              </Grid.Cell>
            </Grid.Row>
          )}
          {(isWaitlistStatus ||
            accessibleUnitWaitlistNumberValue ||
            conventionalUnitWaitlistNumberValue ||
            reviewOrderType === ReviewOrderTypeEnum.lottery) && (
            <Grid.Row columns={3}>
              {/* We need active hidden field to send value even when field is not visible and disabled */}
              {(isWaitlistStatus || accessibleUnitWaitlistNumberValue) && (
                <Grid.Cell>
                  <Field
                    className={
                      isWaitlistStatus && !disableApplicationStatusControls ? "" : "hidden"
                    }
                    type="number"
                    id="application.accessibleUnitWaitlistNumber"
                    name="application.accessibleUnitWaitlistNumber"
                    label={t("application.details.accessibleUnitWaitlistNumber")}
                    register={register}
                    error={!!errors?.application?.accessibleUnitWaitlistNumber}
                    dataTestId="applicationAccessibleUnitWaitlistNumber"
                  />
                  {(!isWaitlistStatus || disableApplicationStatusControls) && (
                    <Field
                      type="number"
                      name="application.accessibleUnitWaitlistNumber"
                      label={t("application.details.accessibleUnitWaitlistNumber")}
                      inputProps={{
                        value: accessibleUnitWaitlistNumberValue,
                      }}
                      disabled
                      dataTestId="applicationAccessibleUnitWaitlistNumberDisplay"
                    />
                  )}
                </Grid.Cell>
              )}
              {/* We need active hidden field to send value even when field is not visible and disabled */}
              {(isWaitlistStatus || conventionalUnitWaitlistNumberValue) && (
                <Grid.Cell>
                  <Field
                    className={
                      isWaitlistStatus && !disableApplicationStatusControls ? "" : "hidden"
                    }
                    type="number"
                    id="application.conventionalUnitWaitlistNumber"
                    name="application.conventionalUnitWaitlistNumber"
                    label={t("application.details.conventionalUnitWaitlistNumber")}
                    register={register}
                    error={!!errors?.application?.conventionalUnitWaitlistNumber}
                    dataTestId="applicationConventionalUnitWaitlistNumber"
                  />
                  {(!isWaitlistStatus || disableApplicationStatusControls) && (
                    <Field
                      type="number"
                      name="application.conventionalUnitWaitlistNumber"
                      label={t("application.details.conventionalUnitWaitlistNumber")}
                      inputProps={{
                        value: conventionalUnitWaitlistNumberValue,
                      }}
                      disabled
                      dataTestId="applicationConventionalUnitWaitlistNumberDisplay"
                    />
                  )}
                </Grid.Cell>
              )}
              {reviewOrderType === ReviewOrderTypeEnum.lottery && (
                <Grid.Cell>
                  <Field
                    className={disableApplicationStatusControls ? "hidden" : ""}
                    type="number"
                    id="application.manualLotteryPositionNumber"
                    name="application.manualLotteryPositionNumber"
                    label={t("application.details.manualLotteryPositionNumber")}
                    register={register}
                    error={!!errors?.application?.manualLotteryPositionNumber}
                    dataTestId="applicationManualLotteryPositionNumber"
                  />
                  {disableApplicationStatusControls && (
                    <Field
                      type="number"
                      name="application.manualLotteryPositionNumber"
                      label={t("application.details.manualLotteryPositionNumber")}
                      inputProps={{
                        value: manualLotteryPositionNumberValue,
                      }}
                      disabled
                      dataTestId="applicationManualLotteryPositionNumberDisplay"
                    />
                  )}
                </Grid.Cell>
              )}
            </Grid.Row>
          )}
        </>
      )}
    </SectionWithGrid>
  )
}

export { FormApplicationData as default, FormApplicationData }
