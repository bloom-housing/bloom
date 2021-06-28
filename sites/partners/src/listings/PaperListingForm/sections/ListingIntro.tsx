import React from "react"
import { useFormContext } from "react-hook-form"
import { t, GridSection, GridCell, Field } from "@bloom-housing/ui-components"

const ListingIntro = () => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register } = formMethods

  return (
    <>
      <span className="form-section__title">{t("listings.sections.introTitle")}</span>
      <span className="form-section__description">{t("listings.sections.introSubtitle")}</span>
      <GridSection columns={3}>
        <GridCell span={2}>
          <Field
            id="name"
            name="name"
            label={t("listings.listingName")}
            placeholder={t("listings.listingName")}
            register={register}
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
    </>
  )
}

export default ListingIntro
