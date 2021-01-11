import {
  t,
  GridSection,
  ViewItem,
  DOBField,
  Select,
  applicationLanguageKeys,
  TimeField,
} from "@bloom-housing/ui-components"
import { useFormContext } from "react-hook-form"

export enum FormApplicationDataFields {
  DateSubmitted = "dateSubmitted",
  TimeSubmitted = "timeSubmitted",
  Language = "application.language",
}

const FormApplicationData = () => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, watch, errors } = formMethods

  return (
    <GridSection title={t("application.details.applicationData")} grid={false}>
      <GridSection columns={3}>
        <ViewItem label={t("application.add.dateSubmitted")}>
          <DOBField
            id={FormApplicationDataFields.DateSubmitted}
            name={FormApplicationDataFields.DateSubmitted}
            register={register}
            error={errors?.dateSubmitted}
            watch={watch}
            label={t("application.add.dateSubmitted")}
            readerOnly
            atAge={false}
            errorMessage={t("errors.dateError")}
          />
        </ViewItem>

        <ViewItem label={t("application.add.timeSubmitted")}>
          <TimeField
            id={FormApplicationDataFields.TimeSubmitted}
            name={FormApplicationDataFields.TimeSubmitted}
            label={t("application.add.timeSubmitted")}
            register={register}
            error={!!errors?.timeSubmitted}
            readerOnly
          />
        </ViewItem>

        <ViewItem label={t("application.add.languageSubmittedIn")}>
          <Select
            id={FormApplicationDataFields.Language}
            name={FormApplicationDataFields.Language}
            label={t("application.add.languageSubmittedIn")}
            labelClassName="sr-only"
            register={register}
            controlClassName="control"
            options={["", ...applicationLanguageKeys]}
            keyPrefix="languages"
          />
        </ViewItem>
      </GridSection>
    </GridSection>
  )
}

export { FormApplicationData as default, FormApplicationData }
