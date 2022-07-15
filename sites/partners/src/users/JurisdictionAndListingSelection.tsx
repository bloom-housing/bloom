import React, { useContext } from "react"
import { useFormContext } from "react-hook-form"
import { t, GridSection, GridCell, Field, FieldGroup, Select } from "@bloom-housing/ui-components"
import { RoleOption, AuthContext } from "@bloom-housing/shared-helpers"

const JurisdictionAndListingSelection = ({ jurisdictionOptions, listingsOptions }) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, errors, getValues, setValue, watch } = useFormContext()
  const { profile } = useContext(AuthContext)
  const selectedRoles = watch("role")
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

  if (profile?.roles?.isAdmin) {
    if (selectedRoles === RoleOption.JurisdictionalAdmin) {
      return (
        <GridSection title={t("t.jurisdiction")} columns={4}>
          <GridCell>
            <Select
              id="jurisdictions"
              name="jurisdictions"
              label={t("t.jurisdiction")}
              placeholder={t("t.selectOne")}
              labelClassName="sr-only"
              register={register}
              controlClassName="control"
              keyPrefix="users"
              options={jurisdictionOptions}
              error={!!errors?.jurisdictions}
              errorMessage={t("errors.requiredFieldError")}
              validation={{ required: true }}
            />
          </GridCell>
        </GridSection>
      )
    } else if (selectedRoles === RoleOption.Partner) {
      return (
        <>
          <GridSection title={t("t.jurisdiction")} columns={4}>
            <GridCell>
              <Field
                id="jurisdiction_all"
                name="jurisdiction_all"
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
            </GridCell>
          </GridSection>
          {selectedJurisdictions && (
            <GridSection columns={4}>
              {Object.keys(listingsOptions).map((key) => {
                if (!selectedJurisdictions.includes(key)) {
                  return null
                }
                const jurisdictionLabel = jurisdictionOptions.find((elem) => elem.id === key)?.label
                return (
                  <GridCell key={`listings_${key}`}>
                    <GridSection
                      title={t("users.jurisdictionalizedListings", {
                        jurisdiction: jurisdictionLabel,
                      })}
                      columns={1}
                    >
                      <GridCell>
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
                      </GridCell>
                    </GridSection>
                  </GridCell>
                )
              })}
            </GridSection>
          )}
        </>
      )
    }
  } else if (profile?.roles?.isJurisdictionalAdmin) {
    if (selectedRoles === RoleOption.Partner && selectedJurisdictions) {
      return (
        <GridSection title={t("nav.listings")} columns={1}>
          {Object.keys(listingsOptions).map((key) => {
            if (!selectedJurisdictions.includes(key)) {
              return null
            }
            const jurisdictionLabel = jurisdictionOptions.find((elem) => elem.id === key)?.label
            return (
              <GridCell key={`listings_${key}`}>
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
              </GridCell>
            )
          })}
        </GridSection>
      )
    }
  }

  return null
}

export { JurisdictionAndListingSelection as default, JurisdictionAndListingSelection }
