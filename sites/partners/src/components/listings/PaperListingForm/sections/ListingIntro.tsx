import React, { useContext } from "react"
import { useFormContext } from "react-hook-form"
import { t, Field, FieldGroup, Select, SelectOption } from "@bloom-housing/ui-components"
import { FieldValue, Grid } from "@bloom-housing/ui-seeds"
import {
  EnumListingListingType,
  YesNoEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { defaultFieldProps, fieldHasError, fieldMessage } from "../../../../lib/helpers"
import SectionWithGrid from "../../../shared/SectionWithGrid"
import { AuthContext } from "@bloom-housing/shared-helpers"
import { usePropertiesList } from "../../../../lib/hooks"

interface ListingIntroProps {
  enableHousingDeveloperOwner?: boolean
  enableListingFileNumber?: boolean
  enableNonRegulatedListings?: boolean
  jurisdictionName: string
  listingId: string
  requiredFields: string[]
}

const getDeveloperLabel = (
  listingType: EnumListingListingType,
  enableHousingDeveloperOwner: boolean
) => {
  if (enableHousingDeveloperOwner) {
    return t("listings.housingDeveloperOwner")
  } else if (listingType === EnumListingListingType.nonRegulated) {
    return t("listings.propertyManager")
  }
  return t("listings.developer")
}

const ListingIntro = (props: ListingIntroProps) => {
  const formMethods = useFormContext()
  const { profile } = useContext(AuthContext)

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, clearErrors, errors, watch, getValues } = formMethods

  const listing = getValues()

  const listingType = watch("listingType")

  const { data } = usePropertiesList({
    page: 1,
    limit: 10,
    jurisdictions: profile?.jurisdictions?.map((jurisdiction) => jurisdiction.id).toString(),
  })

  const propertiesData = data?.items || []

  const propertiyOptions: SelectOption[] =
    propertiesData.length !== 0
      ? [
          { label: "", value: "" },
          ...propertiesData.map((property) => ({
            label: property.name,
            value: property.id,
          })),
        ]
      : []

  return (
    <>
      {(props.listingId || props.jurisdictionName) && (
        <hr className="spacer-section-above spacer-section" />
      )}
      <SectionWithGrid heading={"testing"} subheading={t("listings.sections.introSubtitle")}>
        {props.enableNonRegulatedListings && (
          <Grid.Row columns={1}>
            <Grid.Cell>
              <FieldValue id="listingType" label={t("listings.listingTypeTitle")}>
                {listing.listingType === EnumListingListingType.nonRegulated
                  ? t("listings.nonRegulated")
                  : t("listings.regulated")}
              </FieldValue>
            </Grid.Cell>
          </Grid.Row>
        )}
        <Grid.Row columns={1}>
          <Grid.Cell>
            <Field
              register={register}
              dataTestId={"nameField"}
              {...defaultFieldProps(
                "name",
                t("listings.listingName"),
                props.requiredFields,
                errors,
                clearErrors,
                true
              )}
            />
          </Grid.Cell>
        </Grid.Row>
        <Grid.Row columns={2}>
          {props.enableListingFileNumber && (
            <Grid.Cell>
              <Field
                register={register}
                {...defaultFieldProps(
                  "listingFileNumber",
                  t("listings.listingFileNumber"),
                  props.requiredFields,
                  errors,
                  clearErrors
                )}
              />
            </Grid.Cell>
          )}
          <Grid.Cell>
            <Field
              register={register}
              {...defaultFieldProps(
                "developer",
                getDeveloperLabel(listingType, props.enableHousingDeveloperOwner),
                props.requiredFields,
                errors,
                clearErrors
              )}
            />
          </Grid.Cell>
        </Grid.Row>
        {listingType === EnumListingListingType.nonRegulated &&
          props.enableNonRegulatedListings && (
            <Grid.Row columns={1}>
              <Grid.Cell>
                <FieldGroup
                  name="listingHasHudEbllClearance"
                  type="radio"
                  register={register}
                  groupLabel={t("listings.hasEbllClearanceTitle")}
                  fields={[
                    {
                      id: "listingHasHudEbllClearanceYes",
                      label: t("t.yes"),
                      value: YesNoEnum.yes,
                      defaultChecked: listing?.hasHudEbllClearance,
                    },
                    {
                      id: "listingHasHudEbllClearanceNo",
                      label: t("t.no"),
                      value: YesNoEnum.no,
                      defaultChecked: !listing?.hasHudEbllClearance,
                    },
                  ]}
                  error={fieldHasError(errors.listingHasHudEbllClearance)}
                  errorMessage={fieldMessage(errors.listingHasHudEbllClearance)}
                />
              </Grid.Cell>
            </Grid.Row>
          )}
        {propertiesData.length > 1 && (
          <Grid.Row columns={3}>
            <Grid.Cell>
              <Select
                id={"properties"}
                name={"property.id"}
                register={register}
                error={fieldHasError(errors?.properties?.id)}
                controlClassName={"control"}
                errorMessage={t("errors.requiredFieldError")}
                keyPrefix={"properties"}
                options={propertiyOptions}
                validation={{ required: true }}
              />
            </Grid.Cell>
          </Grid.Row>
        )}
      </SectionWithGrid>
    </>
  )
}

export default ListingIntro
