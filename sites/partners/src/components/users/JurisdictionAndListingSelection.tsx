import React, { useContext } from "react"
import { useFormContext } from "react-hook-form"
import { t, Field, FieldGroup, Select } from "@bloom-housing/ui-components"
import { Grid } from "@bloom-housing/ui-seeds"
import { RoleOption, AuthContext } from "@bloom-housing/shared-helpers"
import SectionWithGrid from "../shared/SectionWithGrid"
import { FeatureFlagEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

const JurisdictionAndListingSelection = ({ jurisdictionOptions, listingsOptions }) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, errors, getValues, setValue, watch } = useFormContext()
  const { profile, doJurisdictionsHaveFeatureFlagOn } = useContext(AuthContext)
  const selectedRoles = watch("userRoles")
  const selectedJurisdictions = watch("jurisdictions")

  /**
   * Control listing checkboxes on select/deselect all listings option
   */
  const updateAllCheckboxes = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const incomingListingIds = listingsOptions[key].map((option) => option.id)
    let currentListingIds = getValues("user_listings")

    if (e.target.checked) {
      const allListingIds = incomingListingIds.reduce(
        (accum, curr) => {
          if (!accum.includes(curr)) {
            // if we are adding listings, make sure we aren't double adding listings
            accum.push(curr)
          } else if (!e.target.checked && accum.includes(curr)) {
            // if we are removing listings
            accum = accum.filter((elem) => elem !== curr)
          }
          return accum
        },
        [...(currentListingIds || [])]
      )
      setValue("user_listings", allListingIds)
    } else {
      if (currentListingIds && !Array.isArray(currentListingIds)) {
        currentListingIds = [currentListingIds]
      } else if (!currentListingIds) {
        currentListingIds = []
      }
      const allListingIds = currentListingIds.filter((elem) => !incomingListingIds.includes(elem))

      setValue("user_listings", allListingIds.length === 0 ? null : allListingIds)
    }
  }

  const updateAllJurisdictionCheckboxes = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.checked) {
      setValue("jurisdictions", [])
    } else {
      const allJurisdictionIds = jurisdictionOptions.map((option) => option.id)
      setValue("jurisdictions", allJurisdictionIds)
    }
  }

  const ListingSection = (renderTitle = false) => {
    return Object.keys(listingsOptions).map((key) => {
      if (!selectedJurisdictions.includes(key)) {
        return null
      }
      const jurisdictionLabel = jurisdictionOptions.find((elem) => elem.id === key)?.label
      return (
        <Grid.Cell key={`listings_${key}`}>
          <SectionWithGrid
            heading={
              renderTitle
                ? t("users.jurisdictionalizedListings", {
                    jurisdiction: jurisdictionLabel,
                  })
                : ""
            }
          >
            <Grid.Row>
              <Grid.Cell>
                <div aria-label={`${jurisdictionLabel} Listing Selection`}>
                  <Field
                    id={`listings_all_${key}`}
                    name={`listings_all_${key}`}
                    label={t("users.alljurisdictionalizedListings", {
                      jurisdiction: jurisdictionLabel,
                    })}
                    register={register}
                    type="checkbox"
                    inputProps={{
                      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                        updateAllCheckboxes(e, key),
                    }}
                    dataTestId={`listings-all-${jurisdictionLabel}`}
                  />

                  <FieldGroup
                    name="user_listings"
                    fields={listingsOptions[key]}
                    type="checkbox"
                    register={register}
                    error={!!errors?.user_listings}
                    errorMessage={t("errors.requiredFieldError")}
                    validation={{ required: true }}
                    dataTestId={`listings_${jurisdictionLabel}`}
                  />
                </div>
              </Grid.Cell>
            </Grid.Row>
          </SectionWithGrid>
        </Grid.Cell>
      )
    })
  }

  if (profile?.userRoles?.isAdmin) {
    if (
      selectedRoles === RoleOption.JurisdictionalAdmin ||
      selectedRoles === RoleOption.LimitedJurisdictionalAdmin
    ) {
      // if disableJurisdictionalAdmin is flagged on for a jurisdiction remove it from selectable options
      const filteredJurisdictionOptions = jurisdictionOptions.filter(
        (option) =>
          !doJurisdictionsHaveFeatureFlagOn(FeatureFlagEnum.disableJurisdictionalAdmin, option.id)
      )
      return (
        <SectionWithGrid heading={t("t.jurisdiction")}>
          <Grid.Row columns={4}>
            <Grid.Cell>
              <Select
                id="jurisdictions"
                name="jurisdictions"
                label={t("t.jurisdiction")}
                placeholder={t("t.selectOne")}
                register={register}
                controlClassName="control"
                keyPrefix="users"
                options={filteredJurisdictionOptions}
                error={!!errors?.jurisdictions}
                errorMessage={t("errors.requiredFieldError")}
                validation={{ required: true }}
              />
            </Grid.Cell>
          </Grid.Row>
        </SectionWithGrid>
      )
    } else if (selectedRoles === RoleOption.Partner) {
      return (
        <>
          <SectionWithGrid heading={t("t.jurisdiction")}>
            <Grid.Row columns={4}>
              <Grid.Cell>
                <Field
                  id="jurisdiction_all"
                  name="jurisdiction_all"
                  dataTestId={"jurisdiction-all"}
                  label={t("users.allJurisdictions")}
                  register={register}
                  type="checkbox"
                  inputProps={{
                    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                      updateAllJurisdictionCheckboxes(e),
                  }}
                />

                <FieldGroup
                  name="jurisdictions"
                  fields={jurisdictionOptions}
                  type="checkbox"
                  register={register}
                  error={!!errors?.jurisdictions}
                  errorMessage={t("errors.requiredFieldError")}
                  validation={{ required: true }}
                  dataTestId={"jurisdictions"}
                />
              </Grid.Cell>
            </Grid.Row>
          </SectionWithGrid>
          {selectedJurisdictions && (
            <Grid>
              <Grid.Row>{ListingSection(true)}</Grid.Row>
            </Grid>
          )}
        </>
      )
    }
  }

  return null
}

export { JurisdictionAndListingSelection as default, JurisdictionAndListingSelection }
