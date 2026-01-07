import React from "react"
import {
  t,
  Select,
  TimeField,
  DateField,
  DateFieldValues,
  Field,
} from "@bloom-housing/ui-components"
import { Grid, FieldValue } from "@bloom-housing/ui-seeds"
import {
  LanguagesEnum,
  ApplicationStatusEnum,
  ReviewOrderTypeEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { useFormContext } from "react-hook-form"
import SectionWithGrid from "../../../shared/SectionWithGrid"

type FormApplicationDataProps = {
  enableApplicationStatus: boolean
  reviewOrderType?: ReviewOrderTypeEnum
}

const FormApplicationData = ({
  enableApplicationStatus,
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
              <Select
                id="application.status"
                name="application.status"
                label={t("application.details.applicationStatus")}
                register={register}
                controlClassName="control"
                options={applicationStatusOptions}
                keyPrefix="application.details.applicationStatus"
              />
            </Grid.Cell>
          </Grid.Row>
          <Grid.Row columns={3}>
            <Grid.Cell className={isWaitlistStatus ? "" : "hidden"}>
              <Field
                type="number"
                id="application.accessibleUnitWaitlistNumber"
                name="application.accessibleUnitWaitlistNumber"
                label={t("application.details.accessibleUnitWaitlistNumber")}
                register={register}
                error={!!errors?.application?.accessibleUnitWaitlistNumber}
              />
            </Grid.Cell>
            {!!accessibleUnitWaitlistNumberValue && !isWaitlistStatus && (
              <Grid.Cell>
                <FieldValue
                  label={t("application.details.accessibleUnitWaitlistNumber")}
                  className="field-value-field-style"
                >
                  {accessibleUnitWaitlistNumberValue}
                </FieldValue>
              </Grid.Cell>
            )}
            <Grid.Cell className={isWaitlistStatus ? "" : "hidden"}>
              <Field
                type="number"
                id="application.conventionalUnitWaitlistNumber"
                name="application.conventionalUnitWaitlistNumber"
                label={t("application.details.conventionalUnitWaitlistNumber")}
                register={register}
                error={!!errors?.application?.conventionalUnitWaitlistNumber}
              />
            </Grid.Cell>
            {!!conventionalUnitWaitlistNumberValue && !isWaitlistStatus && (
              <Grid.Cell>
                <FieldValue
                  label={t("application.details.conventionalUnitWaitlistNumber")}
                  className="field-value-field-style"
                >
                  {conventionalUnitWaitlistNumberValue}
                </FieldValue>
              </Grid.Cell>
            )}
            {reviewOrderType === ReviewOrderTypeEnum.lottery && (
              <Grid.Cell>
                <Field
                  type="number"
                  id="application.manualLotteryPositionNumber"
                  name="application.manualLotteryPositionNumber"
                  label={t("application.details.manualLotteryPositionNumber")}
                  register={register}
                  error={!!errors?.application?.manualLotteryPositionNumber}
                />
              </Grid.Cell>
            )}
          </Grid.Row>
        </>
      )}
    </SectionWithGrid>
  )
}

export { FormApplicationData as default, FormApplicationData }
