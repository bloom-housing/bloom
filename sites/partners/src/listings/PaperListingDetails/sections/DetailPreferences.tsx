import React, { useContext, useMemo } from "react"
import { t, GridSection, MinimalTable } from "@bloom-housing/ui-components"
import { ViewItem } from "../../../../../../detroit-ui-components/src/blocks/ViewItem"
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
      listing?.listingPreferences.map((listingPreference, index) => ({
        order: { content: index + 1 },
        name: { content: listingPreference.preference.title },
        description: { content: listingPreference.preference.description },
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
        <MinimalTable
          id="preferenceTable"
          headers={preferencesTableHeaders}
          data={preferenceTableData}
        />
      ) : (
        <span className="text-base font-semibold pt-4">{t("t.none")}</span>
      )}
    </GridSection>
  )
}

export default DetailPreferences
