import React, { useEffect, useState, useContext } from "react"
import { useFormContext } from "react-hook-form"
import { t, Textarea, Field, PhoneField, Select } from "@bloom-housing/ui-components"
import { Grid } from "@bloom-housing/ui-seeds"
import { AuthContext, stateKeys } from "@bloom-housing/shared-helpers"
import {
  fieldMessage,
  defaultFieldProps,
  getLabel,
  fieldIsRequired,
  getAddressErrorMessage,
} from "../../../../lib/helpers"
import SectionWithGrid from "../../../shared/SectionWithGrid"
import { ListingContext } from "../../ListingContext"
import { FeatureFlagEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

type LeasingAgentProps = {
  enableCompanyWebsite?: boolean
  requiredFields: string[]
}

const LeasingAgent = (props: LeasingAgentProps) => {
  const formMethods = useFormContext()
  const listing = useContext(ListingContext)
  const { doJurisdictionsHaveFeatureFlagOn } = useContext(AuthContext)

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, control, errors, clearErrors, watch, getValues } = formMethods

  const leasingAgentPhoneField: string = watch("leasingAgentPhone")

  const [phoneField, setPhoneField] = useState(leasingAgentPhoneField)

  useEffect(() => {
    // only clear the leasingAgentPhone if the user has changed the field
    if (leasingAgentPhoneField && leasingAgentPhoneField !== phoneField) {
      clearErrors("leasingAgentPhone")
    }
    setPhoneField(leasingAgentPhoneField)
  }, [leasingAgentPhoneField, clearErrors, phoneField])

  const getError = (subfield: string) => {
    return getAddressErrorMessage(
      `listingsLeasingAgentAddress.${subfield}`,
      "listingsLeasingAgentAddress",
      fieldMessage(
        errors?.listingsLeasingAgentAddress ? errors?.listingsLeasingAgentAddress[subfield] : null
      ),
      errors,
      getValues
    )
  }

  const enableLeasingAgentAltText = doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.enableLeasingAgentAltText,
    listing?.jurisdictions?.id
  )

  const leasingAgentNameText = enableLeasingAgentAltText
    ? t("leasingAgent.ManagerPropName")
    : t("leasingAgent.name")

  const leasingAgentSectionTitleText = enableLeasingAgentAltText
    ? t("listings.sections.leasingAgentManagerPropSectionTitle")
    : t("listings.sections.leasingAgentTitle")

  const leasingAgentTitleText = enableLeasingAgentAltText
    ? t("leasingAgent.leasingAgentManagerPropTitle")
    : t("leasingAgent.title")

  const leasingAgentSubtitleText = enableLeasingAgentAltText
    ? t("listings.sections.leasingAgentManagerPropSubtitle")
    : t("listings.sections.leasingAgentSubtitle")

  const leasingAgentAddressText = enableLeasingAgentAltText
    ? t("listings.leasingAgentAddressManagerProp")
    : t("listings.leasingAgentAddress")

  return (
    <>
      <hr className="spacer-section-above spacer-section" />
      <SectionWithGrid heading={leasingAgentSectionTitleText} subheading={leasingAgentSubtitleText}>
        <Grid.Row columns={3}>
          <Grid.Cell>
            <Field
              register={register}
              {...defaultFieldProps(
                "leasingAgentName",
                leasingAgentNameText,
                props.requiredFields,
                errors,
                clearErrors
              )}
            />
          </Grid.Cell>
          <Grid.Cell>
            <Field
              register={register}
              inputProps={{
                onChange: () => clearErrors("leasingAgentEmail"),
              }}
              {...defaultFieldProps(
                "leasingAgentEmail",
                t("t.email"),
                props.requiredFields,
                errors,
                clearErrors
              )}
            />
          </Grid.Cell>
          <Grid.Cell>
            <PhoneField
              control={control}
              controlClassName={"control"}
              {...defaultFieldProps(
                "leasingAgentPhone",
                t("t.phone"),
                props.requiredFields,
                errors,
                clearErrors
              )}
            />
          </Grid.Cell>
        </Grid.Row>
        <Grid.Row columns={3}>
          <Grid.Cell>
            <Field
              register={register}
              {...defaultFieldProps(
                "leasingAgentTitle",
                leasingAgentTitleText,
                props.requiredFields,
                errors,
                clearErrors
              )}
            />
            {props.enableCompanyWebsite && (
              <Field
                register={register}
                {...defaultFieldProps(
                  "managementWebsite",
                  t("leasingAgent.managementWebsite"),
                  props.requiredFields,
                  errors,
                  clearErrors
                )}
              />
            )}
          </Grid.Cell>
          <Grid.Cell className="seeds-grid-span-2">
            <Textarea
              fullWidth={true}
              placeholder={""}
              note={t("leasingAgent.officeHoursPlaceholder")}
              register={register}
              {...defaultFieldProps(
                "leasingAgentOfficeHours",
                t("leasingAgent.officeHours"),
                props.requiredFields,
                errors,
                clearErrors
              )}
            />
          </Grid.Cell>
        </Grid.Row>
        <SectionWithGrid.HeadingRow>{leasingAgentAddressText}</SectionWithGrid.HeadingRow>
        <Grid.Row columns={3}>
          <Grid.Cell className="seeds-grid-span-2">
            <Field
              label={getLabel(
                "listingsLeasingAgentAddress",
                props.requiredFields,
                t("listings.streetAddressOrPOBox")
              )}
              name={"listingsLeasingAgentAddress.street"}
              id={"listingsLeasingAgentAddress.street"}
              register={register}
              errorMessage={getError("street")}
              error={!!getError("street")}
              inputProps={{
                onChange: () => clearErrors("listingsLeasingAgentAddress"),
                "aria-required": fieldIsRequired(
                  "listingsLeasingAgentAddress",
                  props.requiredFields
                ),
              }}
            />
          </Grid.Cell>
          <Grid.Cell>
            <Field
              label={t("application.contact.apt")}
              name={"listingsLeasingAgentAddress.street2"}
              id={"listingsLeasingAgentAddress.street2"}
              register={register}
            />
          </Grid.Cell>
        </Grid.Row>
        <Grid.Row columns={7}>
          <Grid.Cell className="seeds-grid-span-3">
            <Field
              label={getLabel(
                "listingsLeasingAgentAddress",
                props.requiredFields,
                t("application.contact.city")
              )}
              name={"listingsLeasingAgentAddress.city"}
              id={"listingsLeasingAgentAddress.city"}
              register={register}
              errorMessage={getError("city")}
              error={!!getError("city")}
              inputProps={{
                onChange: () => clearErrors("listingsLeasingAgentAddress"),
                "aria-required": fieldIsRequired(
                  "listingsLeasingAgentAddress",
                  props.requiredFields
                ),
              }}
            />
          </Grid.Cell>

          <Grid.Cell className="seeds-grid-span-2">
            <Select
              id={`listingsLeasingAgentAddress.state`}
              name={`listingsLeasingAgentAddress.state`}
              label={getLabel(
                "listingsLeasingAgentAddress",
                props.requiredFields,
                t("application.contact.state")
              )}
              register={register}
              controlClassName="control"
              options={stateKeys}
              keyPrefix="states"
              errorMessage={getError("state")}
              error={!!getError("state")}
              inputProps={{
                onChange: () => clearErrors("listingsLeasingAgentAddress"),
                "aria-required": fieldIsRequired(
                  "listingsLeasingAgentAddress",
                  props.requiredFields
                ),
              }}
            />
          </Grid.Cell>

          <Grid.Cell className="seeds-grid-span-2">
            <Field
              label={getLabel(
                "listingsLeasingAgentAddress",
                props.requiredFields,
                t("application.contact.zip")
              )}
              name={"listingsLeasingAgentAddress.zipCode"}
              id={"listingsLeasingAgentAddress.zipCode"}
              errorMessage={getError("zipCode")}
              error={!!getError("zipCode")}
              register={register}
              inputProps={{
                onChange: () => clearErrors("listingsLeasingAgentAddress"),
                "aria-required": fieldIsRequired(
                  "listingsLeasingAgentAddress",
                  props.requiredFields
                ),
              }}
            />
          </Grid.Cell>
        </Grid.Row>
      </SectionWithGrid>
    </>
  )
}

export default LeasingAgent
