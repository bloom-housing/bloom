import React from "react"
import { useFormContext } from "react-hook-form"
import {
  t,
  GridSection,
  GridCell,
  Field,
  ViewItem,
  Select,
  stateKeys,
} from "@bloom-housing/ui-components"

const BuildingDetails = () => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register } = formMethods

  return (
    <GridSection
      grid={false}
      columns={3}
      separator
      title={t("listings.sections.buildingDetailsTitle")}
      description={t("listings.sections.buildingDetailsSubtitle")}
    >
      <GridSection columns={3}>
        <GridCell span={2}>
          <Field
            label={t("application.contact.streetAddress")}
            name={"buildingAddress.street"}
            id={"buildingAddress.street"}
            placeholder={t("application.contact.streetAddress")}
            register={register}
          />
        </GridCell>
        <Field
          label={t("t.neighborhood")}
          name={"neighborhood"}
          id={"neighborhood"}
          placeholder={t("t.neighborhood")}
          register={register}
        />
      </GridSection>
      <GridSection columns={6}>
        <GridCell span={2}>
          <Field
            label={t("application.contact.city")}
            name={"buildingAddress.city"}
            id={"buildingAddress.city"}
            placeholder={t("application.contact.city")}
            register={register}
          />
        </GridCell>
        <ViewItem label={t("application.contact.state")} className="mb-0">
          <Select
            id={`buildingAddress.state`}
            name={`buildingAddress.state`}
            label={t("application.contact.state")}
            labelClassName="sr-only"
            register={register}
            controlClassName="control"
            options={stateKeys}
            keyPrefix="states"
            errorMessage={t("errors.stateError")}
          />
        </ViewItem>
        <Field
          label={t("application.contact.zip")}
          name={"buildingAddress.zipCode"}
          id={"buildingAddress.zipCode"}
          placeholder={t("application.contact.zip")}
          errorMessage={t("errors.zipCodeError")}
          register={register}
        />
        <GridCell span={2}>
          <Field
            label={t("listings.yearBuilt")}
            name={"yearBuilt"}
            id={"yearBuilt"}
            placeholder={t("listings.yearBuilt")}
            type={"number"}
            register={register}
          />
        </GridCell>
      </GridSection>
      <GridSection columns={3}>
        <Field
          label={t("listings.longitude")}
          name={"buildingAddress.longitude"}
          id={"buildingAddress.longitude"}
          placeholder={t("listings.longitude")}
          register={register}
        />
        <Field
          label={t("listings.latitude")}
          name={"buildingAddress.latitude"}
          id={"buildingAddress.latitude"}
          placeholder={t("listings.latitude")}
          register={register}
        />
      </GridSection>
    </GridSection>
  )
}

export default BuildingDetails
