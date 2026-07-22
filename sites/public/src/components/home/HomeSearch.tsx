import React from "react"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import {
  FeatureFlagEnum,
  Jurisdiction,
  ListingFilterKeys,
  UnitTypeEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { t, Field, Select } from "@bloom-housing/ui-components"
import { Button, Tabs } from "@bloom-housing/ui-seeds"
import { Form, BloomCard } from "@bloom-housing/shared-helpers"
import { isFeatureFlagOn } from "../../lib/helpers"
import { encodeFilterDataToQuery, FilterData } from "../browse/FilterDrawerHelpers"
import styles from "./Home.module.scss"

interface HomeSearchProps {
  jurisdiction: Jurisdiction
}

interface FiltersFormValues {
  county?: string
  bedrooms?: string
  monthlyRent?: {
    maxRent?: string
  }
  availabilities?: boolean
}

interface PropertyNameFormValues {
  [ListingFilterKeys.name]?: string
  availabilities?: boolean
}

const navigateToListings = (router: ReturnType<typeof useRouter>, filterData: FilterData) => {
  const query = encodeFilterDataToQuery(filterData)
  void router.push(`/listings${query ? `?${query}` : ""}`)
}

export const HomeSearch = (props: HomeSearchProps) => {
  const router = useRouter()

  const enableFilterByCounty = isFeatureFlagOn(
    props.jurisdiction,
    FeatureFlagEnum.enableFilterByCounty
  )

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register: registerFilters, handleSubmit: handleFiltersSubmit } =
    useForm<FiltersFormValues>()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register: registerPropertyName, handleSubmit: handlePropertyNameSubmit } =
    useForm<PropertyNameFormValues>()

  const onFiltersSubmit = (data: FiltersFormValues) => {
    const filterData: FilterData = {}
    if (data.county) {
      filterData.jurisdictions = { [data.county]: true }
    }
    if (data.bedrooms) {
      filterData.bedroomTypes = { [data.bedrooms]: true }
    }
    if (data.monthlyRent?.maxRent) {
      filterData.monthlyRent = { minRent: "", maxRent: data.monthlyRent.maxRent }
    }
    if (data.availabilities) {
      filterData.availabilities = { unitsAvailable: true }
    }

    navigateToListings(router, filterData)
  }

  const onPropertyNameSubmit = (data: PropertyNameFormValues) => {
    const filterData: FilterData = {}
    if (data[ListingFilterKeys.name]) {
      filterData.name = data[ListingFilterKeys.name]
    }
    if (data.availabilities) {
      filterData.availabilities = { unitsAvailable: true }
    }
    navigateToListings(router, filterData)
  }

  return (
    <BloomCard>
      <Tabs>
        <Tabs.TabList>
          <Tabs.Tab className={styles["borderless-tab"]}>Search by Filters</Tabs.Tab>
          <Tabs.Tab className={styles["borderless-tab"]}>Search by Property Name</Tabs.Tab>
        </Tabs.TabList>
        <Tabs.TabPanel className={styles["borderless-tab"]}>
          <Form onSubmit={handleFiltersSubmit(onFiltersSubmit)}>
            <div className={styles["hero-search"]}>
              <div className={styles["hero-filter-flex"]}>
                {enableFilterByCounty && props.jurisdiction.subJurisdictions?.length > 0 && (
                  <div className={styles["hero-flex-grow"]}>
                    <Select
                      name="county"
                      label={t("t.county")}
                      placeholder="All Counties"
                      register={registerFilters}
                      options={props.jurisdiction.subJurisdictions?.map((county) => {
                        return {
                          label: county.name,
                          value: county.id,
                        }
                      })}
                    />
                  </div>
                )}
                <Select
                  name={ListingFilterKeys.bedroomTypes}
                  label={t("t.bedrooms")}
                  placeholder="Any"
                  register={registerFilters}
                  options={[
                    { label: "1 Bedroom", value: UnitTypeEnum.oneBdrm },
                    { label: "2 Bedrooms", value: UnitTypeEnum.twoBdrm },
                    { label: "3 Bedrooms", value: UnitTypeEnum.threeBdrm },
                    { label: "4 Bedrooms", value: UnitTypeEnum.fourBdrm },
                    { label: "5 Bedrooms", value: UnitTypeEnum.fiveBdrm },
                  ]}
                />
                <Field
                  name={`${ListingFilterKeys.monthlyRent}.maxRent`}
                  label={t("listings.maxRent")}
                  placeholder="Any"
                  type="currency"
                  prepend="$"
                  register={registerFilters}
                />
              </div>
              <div className={styles["hero-last-checkbox"]}>
                <Field
                  name={ListingFilterKeys.availabilities}
                  type="checkbox"
                  label="Show available units only (hide waitlists)"
                  register={registerFilters}
                />
              </div>
              <div>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  className={styles["hero-submit-button"]}
                >
                  {t("nav.viewListings")}
                </Button>
              </div>
            </div>
          </Form>
        </Tabs.TabPanel>
        <Tabs.TabPanel className={styles["borderless-tab"]}>
          <Form onSubmit={handlePropertyNameSubmit(onPropertyNameSubmit)}>
            <div className={styles["hero-search"]}>
              <div>
                <Field
                  name={ListingFilterKeys.name}
                  label={t("t.listingName")}
                  placeholder="Any"
                  register={registerPropertyName}
                  className={styles["hero-flex-grow"]}
                />
              </div>
              <div className={styles["hero-last-checkbox"]}>
                <Field
                  name={ListingFilterKeys.availabilities}
                  type="checkbox"
                  label="Show available units only (hide waitlists)"
                  register={registerPropertyName}
                />
              </div>
              <div>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  className={styles["hero-submit-button"]}
                >
                  {t("nav.viewListings")}
                </Button>
              </div>
            </div>
          </Form>
        </Tabs.TabPanel>
      </Tabs>
    </BloomCard>
  )
}
