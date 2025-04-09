import React, { useContext, useMemo } from "react"
import { AuthContext, listingSectionQuestions } from "@bloom-housing/shared-helpers"
import {
  FeatureFlagEnum,
  MultiselectQuestionsApplicationSectionEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { t, MinimalTable } from "@bloom-housing/ui-components"
import { FieldValue } from "@bloom-housing/ui-seeds"
import { ListingContext } from "../../ListingContext"
import SectionWithGrid from "../../../shared/SectionWithGrid"

const DetailPrograms = () => {
  const listing = useContext(ListingContext)
  const { doJurisdictionsHaveFeatureFlagOn } = useContext(AuthContext)

  const swapCommunityTypeWithPrograms = doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.swapCommunityTypeWithPrograms,
    listing.jurisdictions.id
  )

  const programsTableHeaders = {
    order: "t.order",
    name: "t.name",
    description: "t.descriptionTitle",
  }

  const programsTableData = useMemo(
    () =>
      listingSectionQuestions(listing, MultiselectQuestionsApplicationSectionEnum.programs)
        ?.sort((firstEl, secondEl) => firstEl.ordinal - secondEl.ordinal)
        .map((program, index) => ({
          order: { content: index + 1 },
          name: { content: program?.multiselectQuestions?.text },
          description: { content: program?.multiselectQuestions?.description },
        })),
    [listing]
  )

  return (
    <SectionWithGrid
      heading={
        !swapCommunityTypeWithPrograms
          ? t("listings.sections.housingProgramsTitle")
          : t("listings.communityTypes")
      }
      inset
      bypassGrid
    >
      <SectionWithGrid.HeadingRow>
        {!swapCommunityTypeWithPrograms
          ? t("listings.activePrograms")
          : t("listings.activeCommunityTypes")}
      </SectionWithGrid.HeadingRow>
      {programsTableData.length ? (
        <MinimalTable
          id="programTable"
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
