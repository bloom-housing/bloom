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
import { Form, tIfExists } from "@bloom-housing/shared-helpers"
import { isFeatureFlagOn } from "../../lib/helpers"
import { encodeFilterDataToQuery, FilterData } from "../browse/FilterDrawerHelpers"
import styles from "./Home.module.scss"
import Markdown from "markdown-to-jsx"

interface HomeSearchProps {
  jurisdiction: Jurisdiction
}

interface FiltersFormValues {
  county?: string
  bedroomTypes?: string
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
  const {
    register: registerFilters,
    handleSubmit: handleFiltersSubmit,
    setValue,
  } = useForm<FiltersFormValues>()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register: registerPropertyName, handleSubmit: handlePropertyNameSubmit } =
    useForm<PropertyNameFormValues>()

  const bedroomTypes = [
    { label: t("t.any"), value: "any" },
    { label: t("listings.unitTypes.studio"), value: UnitTypeEnum.studio },
    { label: t("listings.unitTypes.oneBdrm"), value: UnitTypeEnum.oneBdrm },
    { label: t("listings.unitTypes.twoBdrm"), value: UnitTypeEnum.twoBdrm },
    { label: t("listings.unitTypes.threeBdrm"), value: UnitTypeEnum.threeBdrm },
    { label: t("listings.unitTypes.fourBdrm"), value: UnitTypeEnum.fourBdrm },
    { label: t("listings.unitTypes.fiveBdrm"), value: UnitTypeEnum.fiveBdrm },
    { label: t("listings.unitTypes.sixBdrm"), value: UnitTypeEnum.sixBdrm },
    { label: t("listings.unitTypes.sevenBdrm"), value: UnitTypeEnum.sevenBdrm },
  ]

  const onFiltersSubmit = (data: FiltersFormValues) => {
    const filterData: FilterData = {}
    if (data.county && data.county !== "any") {
      filterData.jurisdictions = { [data.county]: true }
    }
    if (data.bedroomTypes && data.bedroomTypes !== "any") {
      // Bedroom filter should select that bedroom type and all larger bedroom types
      const selectedBedroomTypeIndex = bedroomTypes.findIndex(
        (type) => type.value === data.bedroomTypes
      )
      filterData.bedroomTypes = bedroomTypes.reduce((previous, current, index) => {
        if (index >= selectedBedroomTypeIndex) {
          previous[current.value] = true
        }
        return previous
      }, {} as Record<string, boolean>)
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
    <div className={styles["hero-search-card"]}>
      <Tabs className={styles["hero-search-tabs"]}>
        <Tabs.TabList>
          <Tabs.Tab>{t("welcome.search.byFilter")}</Tabs.Tab>
          <Tabs.Tab>{t("welcome.search.byProperty")}</Tabs.Tab>
        </Tabs.TabList>
        <Tabs.TabPanel className={styles["hero-search-tab-panel"]}>
          <Form onSubmit={handleFiltersSubmit(onFiltersSubmit)}>
            <div className={styles["hero-search"]}>
              <div className={styles["hero-filter-flex"]}>
                {enableFilterByCounty && props.jurisdiction.subJurisdictions?.length > 0 && (
                  <div className={styles["hero-filter-county"]}>
                    <Select
                      name="county"
                      label={t("t.county")}
                      register={registerFilters}
                      controlClassName="control"
                      options={[
                        { label: t("welcome.search.allCounties"), value: "any" },
                        ...props.jurisdiction.subJurisdictions.map((county) => {
                          return {
                            label: county.name,
                            value: county.id,
                          }
                        }),
                      ]}
                    />
                  </div>
                )}
                <Select
                  name={ListingFilterKeys.bedroomTypes}
                  label={t("t.bedrooms")}
                  register={registerFilters}
                  controlClassName="control"
                  options={bedroomTypes}
                />
                <Field
                  name={`${ListingFilterKeys.monthlyRent}.maxRent`}
                  label={t("listings.maxRent")}
                  type="currency"
                  prepend="$"
                  register={registerFilters}
                  setValue={setValue}
                />
              </div>
              <div className={styles["hero-last-checkbox"]}>
                <Field
                  name={ListingFilterKeys.availabilities}
                  type="checkbox"
                  label={t("welcome.search.availabilityFilter")}
                  register={registerFilters}
                />
              </div>
              <div>
                <Button type="submit" variant="primary" size="sm">
                  {t("nav.viewListings")}
                </Button>
              </div>
            </div>
          </Form>
        </Tabs.TabPanel>
        <Tabs.TabPanel className={styles["hero-search-tab-panel"]}>
          <Form onSubmit={handlePropertyNameSubmit(onPropertyNameSubmit)}>
            <div className={styles["hero-search"]}>
              <Field
                name={ListingFilterKeys.name}
                label={t("t.listingName")}
                register={registerPropertyName}
                className={styles["hero-flex-grow"]}
              />
              <div className={styles["hero-last-checkbox"]}>
                <Field
                  name={ListingFilterKeys.availabilities}
                  type="checkbox"
                  label={t("welcome.search.availabilityFilter")}
                  register={registerPropertyName}
                />
              </div>
              <div>
                <Button type="submit" variant="primary" size="sm">
                  {t("nav.viewListings")}
                </Button>
              </div>
            </div>
          </Form>
        </Tabs.TabPanel>
      </Tabs>
      {tIfExists("welcome.searchSubNote") && (
        <div className={styles["hero-search-subNote"]}>
          <Markdown>{t("welcome.searchSubNote")}</Markdown>
        </div>
      )}
    </div>
  )
}
