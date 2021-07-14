import React from "react"
import { useFormContext } from "react-hook-form"
import { t, GridSection, GridCell, Field } from "@bloom-housing/ui-components"

const ListingIntro = () => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { errors, register } = formMethods

  return (
    <GridSection
      columns={3}
      title={t("listings.sections.introTitle")}
      description={t("listings.sections.introSubtitle")}
    >
      <GridCell span={2}>
        <Field
          id="name"
          name="name"
          label={t("listings.listingName")}
          placeholder={t("listings.listingName")}
          register={register}
          error={errors?.name !== undefined}
          errorMessage={t("errors.requiredFieldError")}
          validation={{ required: true }}
        />
      </GridCell>
      <Field
        id="developer"
        name="developer"
        label={t("listings.developer")}
        placeholder={t("listings.developer")}
        register={register}
      />
    </GridSection>
  )
}

export default ListingIntro
