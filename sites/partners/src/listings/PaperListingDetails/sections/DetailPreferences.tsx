import React, { useContext, useMemo } from "react"
import { t, GridSection, MinimalTable, Button, ViewItem } from "@bloom-housing/ui-components"
import { ListingContext } from "../../ListingContext"

const DetailPreferences = () => {
  const listing = useContext(ListingContext)

  const preferencesTableHeaders = {
    order: "t.order",
    name: "t.name",
    description: "t.descriptionTitle",
  }

  const preferenceTableData = useMemo(
    () =>
      listing?.preferences.map((pref, index) => ({
        order: index + 1,
        name: pref.title,
        description: pref.description,
      })),
    [listing]
  )

  return (
    <GridSection
      className="bg-primary-lighter"
      title={t("listings.sections.housingPreferencesTitle")}
      grid={false}
      tinted
      inset
    >
      <ViewItem label={t("listings.activePreferences")} className={"mb-2"} />
      {preferenceTableData.length ? (
        <MinimalTable headers={preferencesTableHeaders} data={preferenceTableData} />
      ) : (
        <span className="text-base font-semibold pt-4">{t("t.none")}</span>
      )}
    </GridSection>
  )
}

export { DetailPreferences as default, DetailPreferences }
