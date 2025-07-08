import React, { useEffect } from "react"
import {
  t,
  Field,
  Select,
  TimeField,
  DateField,
  DateFieldValues,
} from "@bloom-housing/ui-components"
import { Grid } from "@bloom-housing/ui-seeds"
import {
  ApplicationSubmissionTypeEnum,
  LanguagesEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { useFormContext } from "react-hook-form"
import SectionWithGrid from "../../../shared/SectionWithGrid"

type FormApplicationDataProps = {
  appType: ApplicationSubmissionTypeEnum
}

const FormApplicationData = (props: FormApplicationDataProps) => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, watch, errors, setValue } = formMethods

  const dateSubmittedValue: DateFieldValues = watch("dateSubmitted")
  const dateSubmittedError = !!errors?.dateSubmitted
  const isDateFilled =
    dateSubmittedValue?.day && dateSubmittedValue?.month && dateSubmittedValue?.year

  const isDateRequired =
    dateSubmittedValue?.day || dateSubmittedValue?.month || dateSubmittedValue?.year

  const dateReceivedValue: DateFieldValues = watch("dateReceived")
  const dateReceivedError = !!errors?.dateReceived
  const isDateReceivedFilled =
    dateReceivedValue?.day && dateReceivedValue?.month && dateReceivedValue?.year

  const isDateReceivedRequired =
    dateReceivedValue?.day && dateReceivedValue?.month && dateReceivedValue?.year

  useEffect(() => {
    if (dateSubmittedError || !isDateRequired) {
      setValue("timeSubmitted.hours", null)
      setValue("timeSubmitted.minutes", null)
      setValue("timeSubmitted.seconds", null)
    }
  }, [dateSubmittedError, isDateRequired, setValue])

  useEffect(() => {
    if (dateReceivedError || !isDateReceivedRequired) {
      setValue("timeReceived.hours", null)
      setValue("timeReceived.minutes", null)
      setValue("timeReceived.seconds", null)
    }
  }, [dateReceivedError, isDateReceivedRequired, setValue])

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

      {props.appType !== ApplicationSubmissionTypeEnum.electronical && (
        <Grid.Row>
          <Grid.Cell>
            <DateField
              id="dateReceived"
              name="dateReceived"
              register={register}
              error={errors?.dateReceived}
              watch={watch}
              label={t("application.add.dateReceivedAt")}
              errorMessage={t("errors.dateError")}
              required={!!isDateReceivedRequired}
              labelClass={"text__caps-spaced"}
            />
          </Grid.Cell>

          <Grid.Cell>
            <TimeField
              id="timeReceived"
              name="timeReceived"
              label={t("application.add.timeReceivedAt")}
              register={register}
              watch={watch}
              error={!!errors?.timeReceived}
              disabled={!isDateReceivedFilled}
              required={!!isDateReceivedFilled}
              labelClass={"text__caps-spaced"}
            />
          </Grid.Cell>

          <Grid.Cell>
            <Field
              id="application.receivedBy"
              name="application.receivedBy"
              label={t("application.add.receivedBy")}
              placeholder={t("application.add.receivedBy")}
              register={register}
            />
          </Grid.Cell>
        </Grid.Row>
      )}
    </SectionWithGrid>
  )
}

export { FormApplicationData as default, FormApplicationData }
