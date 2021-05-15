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
            id="listing.name"
            name="listing.name"
            label={t("listings.listingName")}
            placeholder={t("listings.listingName")}
            register={register}
            validation={{ required: true }}
          />
        </GridSection>
        <GridSection grid={false} separator>
          <FormAddress
            subtitle={t("listings.property.buildingAddress")}
            dataKey="listing.property.buildingAddress"
            type="mailing"
            register={register}
          />
        </GridSection>
      </GridSection>
      <GridSection grid={false} separator>
        <GridSection columns={3}>
          <Field
            id="listing.property.developer"
            name="listing.property.developer"
            label={t("listings.property.developer")}
            placeholder={t("listings.property.developer")}
            register={register}
          />
          <Field
            id="listing.applicationDeadline"
            name="listing.applicationDeadline"
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
