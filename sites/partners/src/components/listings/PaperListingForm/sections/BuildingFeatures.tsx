import React from "react"
import { useFormContext } from "react-hook-form"
import { t, Textarea, FieldGroup, Field } from "@bloom-housing/ui-components"
import { Grid } from "@bloom-housing/ui-seeds"
import SectionWithGrid from "../../../shared/SectionWithGrid"
import { defaultFieldProps, getLabel } from "../../../../lib/helpers"
import styles from "../ListingForm.module.scss"

type BuildingFeaturesProps = {
  enableAccessibilityFeatures?: boolean
  enablePetPolicyCheckbox?: boolean
  enableParkingFee?: boolean
  enableSmokingPolicyRadio?: boolean
  requiredFields: string[]
}

const BuildingFeatures = (props: BuildingFeaturesProps) => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, errors, clearErrors, getValues } = formMethods

  return (
    <>
      <hr className="spacer-section-above spacer-section" />
      <SectionWithGrid
        heading={t("listings.sections.buildingFeaturesTitle")}
        subheading={t("listings.sections.buildingFeaturesSubtitle")}
      >
        <Grid.Row>
          <Grid.Cell>
            <Textarea
              fullWidth={true}
              placeholder={""}
              register={register}
              maxLength={600}
              {...defaultFieldProps(
                "amenities",
                t("t.propertyAmenities"),
                props.requiredFields,
                errors,
                clearErrors
              )}
            />
          </Grid.Cell>
          <Grid.Cell>
            <Textarea
              fullWidth={true}
              placeholder={""}
              register={register}
              maxLength={600}
              {...defaultFieldProps(
                "accessibility",
                t("t.additionalAccessibility"),
                props.requiredFields,
                errors,
                clearErrors
              )}
            />
          </Grid.Cell>
        </Grid.Row>
        <Grid.Row>
          <Grid.Cell>
            <Textarea
              fullWidth={true}
              placeholder={""}
              register={register}
              maxLength={600}
              {...defaultFieldProps(
                "unitAmenities",
                t("t.unitAmenities"),
                props.requiredFields,
                errors,
                clearErrors
              )}
            />
          </Grid.Cell>
          <Grid.Cell>
            {props.enablePetPolicyCheckbox ? (
              <FieldGroup
                type="checkbox"
                name="petPolicyPreferences"
                groupLabel={t("listings.petPolicyQuestion")}
                register={register}
                fieldLabelClassName={styles["label-option"]}
                fields={[
                  {
                    id: "allowsDogs",
                    label: t("listings.allowsDogs"),
                    value: "allowsDogs",
                    defaultChecked: getValues("allowsDogs"),
                  },
                  {
                    id: "allowsCats",
                    label: t("listings.allowsCats"),
                    value: "allowsCats",
                    defaultChecked: getValues("allowsCats"),
                  },
                ]}
              />
            ) : (
              <Textarea
                fullWidth={true}
                placeholder={""}
                register={register}
                maxLength={600}
                {...defaultFieldProps(
                  "petPolicy",
                  t("t.petsPolicy"),
                  props.requiredFields,
                  errors,
                  clearErrors
                )}
              />
            )}
          </Grid.Cell>
        </Grid.Row>
        <Grid.Row>
          <Grid.Cell>
            <Textarea
              fullWidth={true}
              placeholder={""}
              register={register}
              maxLength={600}
              {...defaultFieldProps(
                "servicesOffered",
                t("t.servicesOffered"),
                props.requiredFields,
                errors,
                clearErrors
              )}
            />
          </Grid.Cell>
          <Grid.Cell>
            {props.enableSmokingPolicyRadio ? (
              <FieldGroup
                type="radio"
                name="smokingPolicy"
                groupLabel={getLabel("smokingPolicy", props.requiredFields, t("t.smokingPolicy"))}
                register={register}
                fields={[
                  {
                    id: "smokingPolicyNoSmokingAllowed",
                    dataTestId: "smokingPolicy.noSmokingAllowed",
                    label: t("listings.smokingPolicyOptions.noSmokingAllowed"),
                    value: "No smoking allowed",
                  },
                  {
                    id: "smokingPolicySmokingAllowed",
                    dataTestId: "smokingPolicy.smokingAllowed",
                    label: t("listings.smokingPolicyOptions.smokingAllowed"),
                    value: "Smoking allowed",
                  },
                  {
                    id: "smokingPolicyUnknown",
                    dataTestId: "smokingPolicy.unknown",
                    label: t("listings.smokingPolicyOptions.unknown"),
                    value: "",
                    inputProps: {
                      //without it empty value is overwritten by id
                      defaultValue: "",
                    },
                  },
                ]}
              />
            ) : (
              <Textarea
                fullWidth={true}
                placeholder={""}
                register={register}
                maxLength={600}
                {...defaultFieldProps(
                  "smokingPolicy",
                  t("t.smokingPolicy"),
                  props.requiredFields,
                  errors,
                  clearErrors
                )}
              />
            )}
          </Grid.Cell>
        </Grid.Row>
        {props.enableParkingFee && (
          <Grid.Row columns={3}>
            <Grid.Cell>
              <Field
                register={register}
                type={"currency"}
                prepend={"$"}
                {...defaultFieldProps(
                  "parkingFee",
                  t("t.parkingFee"),
                  props.requiredFields,
                  errors,
                  clearErrors
                )}
              />
            </Grid.Cell>
          </Grid.Row>
        )}
      </SectionWithGrid>
    </>
  )
}

export default BuildingFeatures
