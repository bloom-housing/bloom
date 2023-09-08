import React, { useContext, useMemo } from "react"
import { t, MinimalTable } from "@bloom-housing/ui-components"
import { FieldValue } from "@bloom-housing/ui-seeds"
import { ListingContext } from "../../ListingContext"
import { ApplicationSection } from "@bloom-housing/backend-core"
import { listingSectionQuestions } from "@bloom-housing/shared-helpers"
import SectionWithGrid from "../../../shared/SectionWithGrid"

const DetailPrograms = () => {
  const listing = useContext(ListingContext)

  const programsTableHeaders = {
    order: "t.order",
    name: "t.name",
    description: "t.descriptionTitle",
  }

  const programsTableData = useMemo(
    () =>
      listingSectionQuestions(listing, ApplicationSection.programs)
        ?.sort((firstEl, secondEl) => firstEl.ordinal - secondEl.ordinal)
        .map((program, index) => ({
          order: { content: index + 1 },
          name: { content: program?.multiselectQuestion?.text },
          description: { content: program?.multiselectQuestion?.description },
        })),
    [listing]
  )

  return (
    <SectionWithGrid heading="Housing Programs" inset bypassGrid>
      <SectionWithGrid.HeadingRow>Active Programs</SectionWithGrid.HeadingRow>
      {programsTableData.length ? (
        <MinimalTable
          className="spacer-section-above"
          headers={programsTableHeaders}
          data={programsTableData}
        />
      ) : (
        <FieldValue className="spacer-section-above">{t("t.none")}</FieldValue>
      )}
    </SectionWithGrid>
  )
}

export default DetailPrograms
