import React, { useContext, useCallback } from "react"
import { Controller, useFormContext } from "react-hook-form"
import {
  t,
  GridSection,
  GridCell,
  Field,
  AuthContext,
  Select,
  ViewItem,
} from "@bloom-housing/ui-components"

const ListingIntro = () => {
  const formMethods = useFormContext()

  const { profile } = useContext(AuthContext)

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { errors, register } = formMethods

  const JurisdictionWrapper = useCallback(() => {
    if (profile.jurisdictions.length === 1) {
      return (
        <Controller
          type="hidden"
          defaultValue={profile.jurisdictions[0].id}
          name="jurisdiction.id"
          as={<input />}
        />
      )
    } else {
      return (
        <GridCell span={2}>
          <ViewItem label={t("t.jurisdiction")}>
            <Select
              id={"jurisdiction.id"}
              name={"jurisdiction.id"}
              label={t("t.jurisdiction")}
              labelClassName="sr-only"
              register={register}
              controlClassName="control"
              error={errors?.jurisdiction?.id !== undefined}
              errorMessage={t("errors.requiredFieldError")}
              validation={{ required: true }}
              options={[
                "",
                ...profile.jurisdictions.map((jurisdiction) => ({
                  label: jurisdiction.name,
                  value: jurisdiction.id,
                })),
              ]}
            />
          </ViewItem>
        </GridCell>
      )
    }
  }, [errors?.jurisdiction?.id, profile.jurisdictions, register])

  return (
    <>
      <GridSection
        columns={3}
        title={t("listings.sections.introTitle")}
        description={t("listings.sections.introSubtitle")}
      >
        <JurisdictionWrapper />
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
    </>
  )
}

export default ListingIntro
