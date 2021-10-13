import React from "react"
import { useFormContext } from "react-hook-form"
import { t, GridSection, Field, Textarea } from "@bloom-housing/ui-components"
import { fieldHasError, fieldMessage } from "../../../../lib/helpers"

const AdditionalFees = () => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, errors, clearErrors } = formMethods
  return (
    <div>
      <GridSection
        grid={false}
        separator
        title={t("listings.sections.additionalFees")}
        description={t("listings.sections.additionalFeesSubtitle")}
      >
        <GridSection columns={3}>
          <Field
            label={t("listings.applicationFee")}
            name={"applicationFee"}
            id={"applicationFee"}
            register={register}
            type={"currency"}
            prepend={"$"}
            placeholder={"0.00"}
          />
          <Field
            label={t("listings.depositMin")}
            name={"depositMin"}
            id={"depositMin"}
            register={register}
            type={"currency"}
            prepend={"$"}
            placeholder={"0.00"}
            error={fieldHasError(errors?.depositMin)}
            errorMessage={fieldMessage(errors?.depositMin)}
            inputProps={{
              onChange: () => clearErrors("depositMin"),
            }}
          />
          <Field
            label={t("listings.depositMax")}
            name={"depositMax"}
            id={"depositMax"}
            register={register}
            type={"currency"}
            prepend={"$"}
            placeholder={"0.00"}
            error={fieldHasError(errors?.depositMax)}
            errorMessage={fieldMessage(errors?.depositMax?.message)}
            inputProps={{
              onChange: () => clearErrors("depositMax"),
            }}
          />
        </GridSection>
        <GridSection columns={2}>
          <Textarea
            label={t("listings.sections.costsNotIncluded")}
            name={"costsNotIncluded"}
            id={"costsNotIncluded"}
            fullWidth={true}
            register={register}
            maxLength={150}
          />
        </GridSection>
      </GridSection>
    </div>
  )
}

export default AdditionalFees
