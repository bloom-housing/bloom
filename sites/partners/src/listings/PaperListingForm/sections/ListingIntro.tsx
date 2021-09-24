import React from "react"
import { useFormContext } from "react-hook-form"
import {
  t,
  GridSection,
  GridCell,
  Field,
  SelectOption,
  Select,
  ViewItem,
} from "@bloom-housing/ui-components"

interface ListingIntroProps {
  jurisdictionOptions: SelectOption[]
}
const ListingIntro = (props: ListingIntroProps) => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { errors, register, clearErrors } = formMethods

  const hideSelect = props.jurisdictionOptions.length <= 2
  return (
    <GridSection
      columns={3}
      title={t("listings.sections.introTitle")}
      description={t("listings.sections.introSubtitle")}
    >
      <GridCell span={2} className={`${hideSelect ? "hidden" : ""}`}>
        <ViewItem
          label={t("t.jurisdiction")}
          error={errors?.jurisdiction !== undefined || errors?.["jurisdiction.id"] !== undefined}
        >
          <Select
            id={"jurisdiction.id"}
            name={"jurisdiction.id"}
            label={t("t.jurisdiction")}
            labelClassName="sr-only"
            register={register}
            controlClassName={`control ${hideSelect ? "hidden" : ""}`}
            error={errors?.jurisdiction !== undefined || errors?.["jurisdiction.id"] !== undefined}
            errorMessage={
              errors?.jurisdiction?.message ?? errors?.["jurisdiction.id"]?.message ?? undefined
            }
            keyPrefix={"jurisdictions"}
            options={props.jurisdictionOptions}
            inputProps={{
              onChange: () => clearErrors("jurisdiction"),
            }}
          />
        </ViewItem>
      </GridCell>
      <GridCell span={2}>
        <Field
          id="name"
          name="name"
          label={t("listings.listingName")}
          placeholder={t("listings.listingName")}
          inputProps={{
            onChange: () => clearErrors("name"),
          }}
          register={register}
          error={errors?.name !== undefined}
          errorMessage={errors?.name?.message}
        />
      </GridCell>
      <Field
        id="developer"
        name="developer"
        label={t("listings.developer")}
        placeholder={t("listings.developer")}
        error={errors?.developer !== undefined}
        errorMessage={errors?.developer?.message}
        inputProps={{
          onChange: () => clearErrors("developer"),
        }}
        register={register}
      />
    </GridSection>
  )
}

export default ListingIntro
