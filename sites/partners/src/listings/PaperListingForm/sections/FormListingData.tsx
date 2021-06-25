import React from "react"
import { useFormContext } from "react-hook-form"
import { t, GridSection, Field, FormAddress } from "@bloom-housing/ui-components"

const FormListingData = () => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register } = formMethods

  return (
    <div>
      <GridSection grid={false} separator>
        <GridSection columns={3}>
          <Field
            id="name"
            name="name"
            label={t("listings.listingName")}
            placeholder={t("listings.listingName")}
            register={register}
          />
        </GridSection>
        <GridSection grid={false} separator>
          <FormAddress
            subtitle={t("listings.buildingAddress")}
            dataKey="buildingAddress"
            type="mailing"
            register={register}
          />
        </GridSection>
      </GridSection>
      <GridSection grid={false} separator>
        <GridSection columns={3}>
          <Field
            id="developer"
            name="developer"
            label={t("listings.developer")}
            placeholder={t("listings.developer")}
            register={register}
          />
          <Field
            id="applicationDueDate"
            name="applicationDueDate"
            label={t("listings.applicationDeadline")}
            placeholder="MM-DD-YYYY"
            register={register}
          />
        </GridSection>
      </GridSection>
    </div>
  )
}

export default FormListingData
