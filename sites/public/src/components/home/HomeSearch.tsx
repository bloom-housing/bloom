import React, { useContext } from "react"
import {
  FeatureFlagEnum,
  Jurisdiction,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { t, Field, Select } from "@bloom-housing/ui-components"
import { Button, Card, Grid, Tabs } from "@bloom-housing/ui-seeds"
import { AuthContext, BloomCard } from "@bloom-housing/shared-helpers"
import { isFeatureFlagOn } from "../../lib/helpers"
import styles from "./Home.module.scss"

interface HomeSearchProps {
  jurisdiction: Jurisdiction
}

export const HomeSearch = (props: HomeSearchProps) => {
  const enableRegions = isFeatureFlagOn(props.jurisdiction, FeatureFlagEnum.enableRegions)

  const enableFilterByCounty = isFeatureFlagOn(
    props.jurisdiction,
    FeatureFlagEnum.enableFilterByCounty
  )

  return (
    <BloomCard>
      <Card.Section>
        <Tabs>
          <Tabs.TabList>
            <Tabs.Tab>Search by Filters</Tabs.Tab>
            <Tabs.Tab>Search by Property Name</Tabs.Tab>
          </Tabs.TabList>
          <Tabs.TabPanel>
            <div className={styles["hero-search"]}>
              {/* <Grid.Row columns={3}> */}
              {enableFilterByCounty && props.jurisdiction.subJurisdictions?.length > 0 && (
                <Select
                  name="county"
                  label={t("t.county")}
                  placeholder="All Counties"
                  options={props.jurisdiction.subJurisdictions?.map((county) => {
                    return {
                      label: county.name,
                      value: county.id,
                    }
                  })}
                />
              )}
              {/* <Grid.Cell> */}
              <Select
                name="bedrooms"
                label={t("t.bedrooms")}
                placeholder="Any"
                options={[
                  { label: "1 Bedroom", value: "1" },
                  { label: "2 Bedrooms", value: "2" },
                  { label: "3 Bedrooms", value: "3" },
                  { label: "4 Bedrooms", value: "4" },
                  { label: "5 Bedrooms", value: "5" },
                ]}
              />
              {/* </Grid.Cell> */}
              {/* <Grid.Cell> */}
              <Field
                name="maxRent"
                label={t("listings.maxRent")}
                placeholder="Any"
                type="currency"
                prepend="$"
              />
              {/* </Grid.Cell> */}
              {/* <Grid.Cell> */}
              <Button href="/listings" variant="primary-outlined">
                {t("nav.viewListings")}
              </Button>
              {/* </Grid.Cell> */}
              {/* </Grid.Row> */}
            </div>
          </Tabs.TabPanel>
          <Tabs.TabPanel>
            <div className={styles["hero-search"]}>
              <Field name="maxRent" label={t("listings.maxRent")} placeholder="Any" />
              <Button href="/listings" variant="primary-outlined">
                {t("nav.viewListings")}
              </Button>
            </div>
          </Tabs.TabPanel>
        </Tabs>
      </Card.Section>
    </BloomCard>
  )
}
