import React from "react"
import { useFormContext } from "react-hook-form"
import { t, GridSection, Field } from "@bloom-housing/ui-components"

const FormListingData = () => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register } = formMethods

  return (
    <GridSection columns={3} separator>
      <Field
        id="applicationDueDate"
        name="applicationDueDate"
        label={t("listings.applicationDeadline")}
        placeholder="MM-DD-YYYY"
        register={register}
      />
    </GridSection>
  )
}

export default FormListingData
