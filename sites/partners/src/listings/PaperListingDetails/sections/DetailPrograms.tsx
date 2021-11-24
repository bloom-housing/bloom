import React, { useContext, useMemo } from "react"
import { t, GridSection, MinimalTable, ViewItem } from "@bloom-housing/ui-components"
import { ListingContext } from "../../ListingContext"

const DetailPrograms = () => {
  const listing = useContext(ListingContext)

  const programsTableHeaders = {
    order: "t.order",
    name: "t.name",
    description: "t.descriptionTitle",
  }

  const programsTableData = useMemo(
    () =>
      listing?.listingPrograms
        .sort((firstEl, secondEl) => firstEl.ordinal - secondEl.ordinal)
        .map((program, index) => ({
          order: index + 1,
          name: program.program.title,
          description: program.program.description,
        })),
    [listing]
  )

  return (
    <GridSection
      className="bg-primary-lighter"
      title={"Housing Programs"}
      grid={false}
      tinted
      inset
    >
      <ViewItem label={"Active Programs"} className={"mb-2"} />
      {programsTableData.length ? (
        <MinimalTable headers={programsTableHeaders} data={programsTableData} />
      ) : (
        <span className="text-base font-semibold pt-4">{t("t.none")}</span>
      )}
    </GridSection>
  )
}

export default DetailPrograms
