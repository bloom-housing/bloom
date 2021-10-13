<<<<<<< HEAD
import React from "react"
import { useFormContext } from "react-hook-form"
=======
import React, { useContext, useCallback } from "react"
import { Controller, useFormContext } from "react-hook-form"
>>>>>>> master
import {
  t,
  GridSection,
  GridCell,
  Field,
<<<<<<< HEAD
  SelectOption,
  Select,
  ViewItem,
} from "@bloom-housing/ui-components"
import { fieldMessage, fieldHasError } from "../../../../lib/helpers"
=======
  AuthContext,
  Select,
  ViewItem,
} from "@bloom-housing/ui-components"
>>>>>>> master

interface ListingIntroProps {
  jurisdictionOptions: SelectOption[]
}
const ListingIntro = (props: ListingIntroProps) => {
  const formMethods = useFormContext()

  const { profile } = useContext(AuthContext)

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, clearErrors, errors } = formMethods

<<<<<<< HEAD
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
            subNote={t("listings.requiredToPublish")}
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
          subNote={t("listings.requiredToPublish")}
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
        subNote={t("listings.requiredToPublish")}
        error={fieldHasError(errors?.developer)}
        errorMessage={fieldMessage(errors?.developer)}
        inputProps={{
          onChange: () => clearErrors("developer"),
        }}
        register={register}
      />
    </GridSection>
=======
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
>>>>>>> master
  )
}

export default ListingIntro
