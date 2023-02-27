import React from "react"
import { useFormContext } from "react-hook-form"
import { t, GridSection, GridCell, Field, SelectOption, Select } from "@bloom-housing/ui-components"
import { ViewItem } from "../../../../../../../detroit-ui-components/src/blocks/ViewItem"
import { fieldMessage, fieldHasError } from "../../../../lib/helpers"
import { Jurisdiction } from "@bloom-housing/backend-core/types"

interface ListingIntroProps {
  jurisdictions: Jurisdiction[]
}
const ListingIntro = (props: ListingIntroProps) => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, clearErrors, errors } = formMethods

  const jurisdictionOptions: SelectOption[] = [
    { label: "", value: "" },
    ...props.jurisdictions.map((jurisdiction) => ({
      label: jurisdiction.name,
      value: jurisdiction.id,
    })),
  ]
  const defaultJurisdiction = props.jurisdictions.length === 1 ? props.jurisdictions[0].id : ""
  return (
    <GridSection
      columns={3}
      title={t("listings.sections.introTitle")}
      description={t("listings.sections.introSubtitle")}
    >
      <GridCell span={2} className={`${defaultJurisdiction ? "hidden" : ""}`}>
        <ViewItem
          label={t("t.jurisdiction")}
          error={fieldHasError(errors?.jurisdiction) || fieldHasError(errors?.["jurisdiction.id"])}
        >
          <Select
            id={"jurisdiction.id"}
            defaultValue={defaultJurisdiction}
            name={"jurisdiction.id"}
            label={t("t.jurisdiction")}
            labelClassName="sr-only"
            register={register}
            controlClassName={`control ${defaultJurisdiction ? "hidden" : ""}`}
            error={
              fieldHasError(errors?.jurisdiction) || fieldHasError(errors?.["jurisdiction.id"])
            }
            subNote={t("listings.requiredToPublish")}
            errorMessage={
              fieldMessage(errors?.jurisdiction) ??
              fieldMessage(errors?.["jurisdiction.id"]) ??
              undefined
            }
            keyPrefix={"jurisdictions"}
            options={jurisdictionOptions}
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
          subNote={t("listings.requiredToPublish")}
          register={register}
          error={fieldHasError(errors?.name)}
          errorMessage={fieldMessage(errors?.name)}
          dataTestId={"nameField"}
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
