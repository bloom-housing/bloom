import React, { useEffect, useState } from "react"
import { useFormContext } from "react-hook-form"
import { t, Select, Textarea, FieldGroup, Field } from "@bloom-housing/ui-components"
import { FieldValue, Grid } from "@bloom-housing/ui-seeds"
import {
  ReservedCommunityType,
  YesNoEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { useReservedCommunityTypeList } from "../../../../lib/hooks"
import {
  arrayToFormOptions,
  defaultFieldProps,
  fieldHasError,
  fieldIsRequired,
  fieldMessage,
  getLabel,
} from "../../../../lib/helpers"
import { FormListing } from "../../../../lib/listings/formTypes"
import SectionWithGrid from "../../../shared/SectionWithGrid"
import styles from "../ListingForm.module.scss"

type CommunityTypeProps = {
  disableReservedCommunityTypeEdit?: boolean
  listing?: FormListing
  requiredFields: string[]
  swapCommunityTypeWithPrograms?: boolean
}

const CommunityType = ({
  disableReservedCommunityTypeEdit,
  listing,
  requiredFields,
  swapCommunityTypeWithPrograms,
}: CommunityTypeProps) => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, setValue, watch, errors, clearErrors } = formMethods
  const reservedCommunityType = watch("reservedCommunityTypes.id")

  const [options, setOptions] = useState([])

  // Store the reserved community description in state for immediate updates
  const [description, setDescription] = useState<string>("")

  const { data: reservedCommunityTypes = [], loading } = useReservedCommunityTypeList()

  useEffect(() => {
    if (!options.length && !loading) {
      const optionsTranslated = reservedCommunityTypes.map((communityType) => {
        return {
          ...communityType,
          name: t(`listings.reservedCommunityTypes.${communityType.name}`),
        }
      })
      setOptions([
        "",
        ...arrayToFormOptions<ReservedCommunityType>(optionsTranslated, "name", "id"),
      ])
    }
  }, [options, reservedCommunityTypes, loading])

  // Set reservedCommunityTypes.id from listing only after options are loaded
  useEffect(() => {
    if (listing?.reservedCommunityTypes?.id && !reservedCommunityType && options.length > 0) {
      setValue("reservedCommunityTypes.id", listing.reservedCommunityTypes.id)
    }
  }, [listing?.reservedCommunityTypes?.id, reservedCommunityType, setValue, options])

  // Always update description state and form value when reservedCommunityType or types change
  useEffect(() => {
    if (reservedCommunityType && reservedCommunityTypes.length > 0) {
      const matchedType = reservedCommunityTypes.find((type) => type.id === reservedCommunityType)
      const desc = matchedType?.description ?? ""
      setValue("reservedCommunityDescription", desc)
      setDescription(desc)
    } else {
      setDescription("")
    }
  }, [reservedCommunityType, reservedCommunityTypes, setValue])

  useEffect(() => {
    if (
      listing &&
      watch("includeCommunityDisclaimerQuestion") === null &&
      listing?.includeCommunityDisclaimer !== null
    ) {
      setValue(
        "includeCommunityDisclaimerQuestion",
        listing?.includeCommunityDisclaimer ? YesNoEnum.yes : YesNoEnum.no
      )
    }
  }, [setValue, listing?.includeCommunityDisclaimer, watch, listing])

  return !swapCommunityTypeWithPrograms ? (
    <>
      <hr className="spacer-section-above spacer-section" />
      <SectionWithGrid
        heading={t("listings.sections.communityType")}
        subheading={t("listings.sections.communityTypeSubtitle")}
      >
        <Grid.Row columns={2}>
          {options && (
            <Grid.Cell>
              <Select
                id={`reservedCommunityTypes.id`}
                name={`reservedCommunityTypes.id`}
                label={getLabel(
                  "reservedCommunityTypes",
                  requiredFields,
                  t("listings.reservedCommunityType")
                )}
                register={register}
                controlClassName="control"
                options={options}
                inputProps={{
                  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => {
                    setValue("reservedCommunityTypes.id", e.target.value)
                    fieldHasError(errors?.reservedCommunityTypes) &&
                      clearErrors("reservedCommunityTypes")
                  },
                  "aria-required": fieldIsRequired("reservedCommunityTypes", requiredFields),
                }}
                error={fieldHasError(errors?.reservedCommunityTypes)}
                errorMessage={fieldMessage(errors?.reservedCommunityTypes)}
              />
            </Grid.Cell>
          )}
        </Grid.Row>
        <Grid.Row
          columns={3}
          className={!disableReservedCommunityTypeEdit ? styles["hidden-field"] : ""}
        >
          <Grid.Cell className="seeds-grid-span-2">
            {disableReservedCommunityTypeEdit && (
              <FieldValue label={t("listings.reservedCommunityDescription")}>
                {description || t("t.none")}
              </FieldValue>
            )}
          </Grid.Cell>
        </Grid.Row>
        <Grid.Row
          columns={3}
          className={disableReservedCommunityTypeEdit ? styles["hidden-field"] : ""}
        >
          <Grid.Cell className="seeds-grid-span-2">
            <div>
              <Textarea
                label={getLabel(
                  "reservedCommunityDescription",
                  requiredFields,
                  t("listings.reservedCommunityDescription")
                )}
                placeholder={""}
                name={"reservedCommunityDescription"}
                id={"reservedCommunityDescription"}
                fullWidth={true}
                register={register}
                note={t("listings.appearsInListing")}
                errorMessage={fieldMessage(errors?.reservedCommunityDescription)}
                inputProps={{
                  onChange: () => {
                    fieldHasError(errors?.reservedCommunityDescription) &&
                      clearErrors("reservedCommunityDescription")
                  },
                  "aria-required": fieldIsRequired("reservedCommunityDescription", requiredFields),
                }}
              />
            </div>
          </Grid.Cell>
        </Grid.Row>

        <Grid.Row columns={1}>
          <Grid.Cell>
            <FieldGroup
              groupLabel={t("listings.includeCommunityDisclaimer")}
              name="includeCommunityDisclaimerQuestion"
              fieldLabelClassName={`${styles["label-option"]} seeds-m-bs-2`}
              type="radio"
              register={register}
              fields={[
                {
                  label: t("t.yes"),
                  value: YesNoEnum.yes,
                  id: "includeCommunityDisclaimerYes",
                  disabled: !reservedCommunityType,
                },
                {
                  label: t("t.no"),
                  value: YesNoEnum.no,
                  id: "includeCommunityDisclaimerNo",
                  disabled: !reservedCommunityType,
                },
              ]}
            />
          </Grid.Cell>
        </Grid.Row>

        {watch("includeCommunityDisclaimerQuestion") === YesNoEnum.yes && reservedCommunityType && (
          <>
            <Grid.Row columns={3}>
              <Grid.Cell className="seeds-grid-span-2">
                <Field
                  register={register}
                  subNote={t("listings.appearsAsFirstPage")}
                  {...defaultFieldProps(
                    "communityDisclaimerTitle",
                    t("listings.reservedCommunityDisclaimerTitle"),
                    requiredFields,
                    errors,
                    clearErrors,
                    true
                  )}
                />
              </Grid.Cell>
            </Grid.Row>

            <Grid.Row columns={3}>
              <Grid.Cell className="seeds-grid-span-2">
                <Textarea
                  fullWidth={true}
                  register={register}
                  note={t("listings.appearsAsFirstPage")}
                  {...defaultFieldProps(
                    "communityDisclaimerDescription",
                    t("listings.reservedCommunityDisclaimer"),
                    requiredFields,
                    errors,
                    clearErrors,
                    true
                  )}
                />
              </Grid.Cell>
            </Grid.Row>
          </>
        )}
      </SectionWithGrid>
    </>
  ) : (
    <></>
  )
}

export default CommunityType
