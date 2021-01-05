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

const FormApplicationData = () => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, watch, errors } = formMethods

  return (
    <GridSection title={t("application.details.applicationData")} grid={false}>
      <GridSection columns={3}>
        <ViewItem label={t("application.add.dateSubmitted")}>
          <DOBField
            id="dateSubmitted"
            name="dateSubmitted"
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
            id="timeSubmitted"
            name="timeSubmitted"
            label={t("application.add.timeSubmitted")}
            register={register}
            error={!!errors?.timeSubmitted}
            readerOnly
          />
        </ViewItem>

        <ViewItem label={t("application.add.languageSubmittedIn")}>
          <Select
            id="application.language"
            name="application.language"
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
