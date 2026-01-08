import React from "react"
import { t, Select, TimeField, DateField, DateFieldValues } from "@bloom-housing/ui-components"
import { Grid } from "@bloom-housing/ui-seeds"
import {
  LanguagesEnum,
  ApplicationStatusEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { useFormContext } from "react-hook-form"
import SectionWithGrid from "../../../shared/SectionWithGrid"

type FormApplicationDataProps = {
  enableApplicationStatus: boolean
}

const FormApplicationData = ({ enableApplicationStatus }: FormApplicationDataProps) => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, watch, errors, setValue } = formMethods

  const dateSubmittedValue: DateFieldValues = watch("dateSubmitted")
  const isDateFilled =
    dateSubmittedValue?.day && dateSubmittedValue?.month && dateSubmittedValue?.year

  const isDateRequired =
    dateSubmittedValue?.day || dateSubmittedValue?.month || dateSubmittedValue?.year

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
      )}
    </SectionWithGrid>
  )
}

export { FormApplicationData as default, FormApplicationData }
