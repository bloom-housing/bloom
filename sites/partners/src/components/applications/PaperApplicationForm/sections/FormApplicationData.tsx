import React from "react"
import {
  t,
  Select,
  TimeField,
  DateField,
  DateFieldValues,
  Field,
} from "@bloom-housing/ui-components"
import { Grid } from "@bloom-housing/ui-seeds"
import {
  LanguagesEnum,
  ApplicationStatusEnum,
  ReviewOrderTypeEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { useFormContext } from "react-hook-form"
import SectionWithGrid from "../../../shared/SectionWithGrid"

type FormApplicationDataProps = {
  enableApplicationStatus: boolean
  disableApplicationStatusControls?: boolean
  reviewOrderType?: ReviewOrderTypeEnum
}

const FormApplicationData = ({
  enableApplicationStatus,
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

  const applicationStatus: ApplicationStatusEnum = watch("application.status")

  const accessibleUnitWaitlistNumberValue = watch("application.accessibleUnitWaitlistNumber")
  const conventionalUnitWaitlistNumberValue = watch("application.conventionalUnitWaitlistNumber")
  const manualLotteryPositionNumberValue = watch("application.manualLotteryPositionNumber")

  const isWaitlistStatus =
    applicationStatus === ApplicationStatusEnum.waitlist ||
    applicationStatus === ApplicationStatusEnum.waitlistDeclined

  const applicationStatusOptions = Array.from(Object.values(ApplicationStatusEnum))
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
          </Grid.Row>
          <Grid.Row columns={3}>
            {/* We need active hidden field to send value even when field is not visible and disabled */}
            <Grid.Cell
              className={isWaitlistStatus || accessibleUnitWaitlistNumberValue ? "" : "hidden"}
            >
              <Field
                className={isWaitlistStatus && !disableApplicationStatusControls ? "" : "hidden"}
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
            {/* We need active hidden field to send value even when field is not visible and disabled */}
            <Grid.Cell
              className={isWaitlistStatus || conventionalUnitWaitlistNumberValue ? "" : "hidden"}
            >
              <Field
                className={isWaitlistStatus && !disableApplicationStatusControls ? "" : "hidden"}
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
        </>
      )}
    </SectionWithGrid>
  )
}

export { FormApplicationData as default, FormApplicationData }
