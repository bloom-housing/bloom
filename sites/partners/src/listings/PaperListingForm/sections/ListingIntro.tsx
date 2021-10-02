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
import { fieldMessage, fieldHasError } from "../../../../lib/helpers"

interface ListingIntroProps {
  jurisdictionOptions: SelectOption[]
}
const ListingIntro = (props: ListingIntroProps) => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, clearErrors, errors } = formMethods

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
          error={fieldHasError(errors?.jurisdiction) || fieldHasError(errors?.["jurisdiction.id"])}
        >
          <Select
            id={"jurisdiction.id"}
            name={"jurisdiction.id"}
            label={t("t.jurisdiction")}
            labelClassName="sr-only"
            register={register}
            controlClassName={`control ${hideSelect ? "hidden" : ""}`}
            error={
              fieldHasError(errors?.jurisdiction) || fieldHasError(errors?.["jurisdiction.id"])
            }
            errorMessage={
              fieldMessage(errors?.jurisdiction) ??
              fieldMessage(errors?.["jurisdiction.id"]) ??
              undefined
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
          error={fieldHasError(errors?.name)}
          errorMessage={fieldMessage(errors?.name)}
        />
      </GridCell>
      <Field
        id="developer"
        name="developer"
        label={t("listings.developer")}
        placeholder={t("listings.developer")}
        error={fieldHasError(errors?.developer)}
        errorMessage={fieldMessage(errors?.developer)}
        inputProps={{
          onChange: () => clearErrors("developer"),
        }}
        register={register}
      />
    </GridSection>
  )
}

export default ListingIntro
