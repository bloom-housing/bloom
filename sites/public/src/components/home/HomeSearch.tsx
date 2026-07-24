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
import { Button, Card, Tabs } from "@bloom-housing/ui-seeds"
import { Form, BloomCard, tIfExists } from "@bloom-housing/shared-helpers"
import { isFeatureFlagOn } from "../../lib/helpers"
import { encodeFilterDataToQuery, FilterData } from "../browse/FilterDrawerHelpers"
import styles from "./Home.module.scss"
import Markdown from "markdown-to-jsx"

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
    <div className={styles["hero-search-card"]}>
      <BloomCard className={styles["hero-search-card"]}>
        <Card.Section>
          <Tabs className={styles["hero-search-tabs"]}>
            <Tabs.TabList>
              <Tabs.Tab>{t("welcome.search.byFilter")}</Tabs.Tab>
              <Tabs.Tab>{t("welcome.search.byProperty")}</Tabs.Tab>
            </Tabs.TabList>
            <Tabs.TabPanel>
              <Form onSubmit={handleFiltersSubmit(onFiltersSubmit)}>
                <div className={styles["hero-search"]}>
                  <div className={styles["hero-filter-flex"]}>
                    {enableFilterByCounty && props.jurisdiction.subJurisdictions?.length > 0 && (
                      <Select
                        name="county"
                        label={t("t.county")}
                        placeholder="All Counties"
                        register={registerFilters}
                        controlClassName="control"
                        options={props.jurisdiction.subJurisdictions?.map((county) => {
                          return {
                            label: county.name,
                            value: county.id,
                          }
                        })}
                      />
                    )}
                    <Select
                      name={ListingFilterKeys.bedroomTypes}
                      label={t("t.bedrooms")}
                      placeholder={t("t.any")}
                      register={registerFilters}
                      controlClassName="control"
                      options={[
                        { label: t("listings.unitTypes.studio"), value: UnitTypeEnum.studio },
                        { label: t("listings.unitTypes.oneBdrm"), value: UnitTypeEnum.oneBdrm },
                        { label: t("listings.unitTypes.twoBdrm"), value: UnitTypeEnum.twoBdrm },
                        { label: t("listings.unitTypes.threeBdrm"), value: UnitTypeEnum.threeBdrm },
                        { label: t("listings.unitTypes.fourBdrm"), value: UnitTypeEnum.fourBdrm },
                        { label: t("listings.unitTypes.fiveBdrm"), value: UnitTypeEnum.fiveBdrm },
                      ]}
                    />
                    {/* TODO: limit to numberic input */}
                    <Field
                      name={`${ListingFilterKeys.monthlyRent}.maxRent`}
                      label={t("listings.maxRent")}
                      placeholder={t("t.any")}
                      type="currency"
                      prepend="$"
                      register={registerFilters}
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
            <Tabs.TabPanel>
              <Form onSubmit={handlePropertyNameSubmit(onPropertyNameSubmit)}>
                <div className={styles["hero-search"]}>
                  <Field
                    name={ListingFilterKeys.name}
                    label={t("t.listingName")}
                    placeholder={t("t.any")}
                    register={registerPropertyName}
                    className={styles["hero-flex-grow"]}
                  />
                  <Field
                    name={ListingFilterKeys.availabilities}
                    type="checkbox"
                    label={t("welcome.search.availabilityFilter")}
                    register={registerPropertyName}
                    className={styles["hero-last-checkbox"]}
                  />
                  <div>
                    <Button type="submit" variant="primary" size="sm">
                      {t("nav.viewListings")}
                    </Button>
                  </div>
                </div>
              </Form>
            </Tabs.TabPanel>
          </Tabs>
        </Card.Section>
      </BloomCard>
      {tIfExists("welcome.searchSubNote") && (
        <div className={styles["hero-search-subNote"]}>
          <Markdown>{t("welcome.searchSubNote")}</Markdown>
        </div>
      )}
    </div>
  )
}
