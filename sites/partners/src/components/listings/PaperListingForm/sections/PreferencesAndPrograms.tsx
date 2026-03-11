import React from "react"
import {
  MultiselectQuestion,
  MultiselectQuestionsApplicationSectionEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { t } from "@bloom-housing/ui-components"
import SelectAndOrder from "./SelectAndOrder"
import { FormListing } from "../../../../lib/listings/formTypes"

type ProgramsAndPreferencesProps = {
  disableListingPreferences?: boolean
  swapCommunityTypeWithPrograms?: boolean
  enableV2MSQ?: boolean
  listing?: FormListing
  jurisdiction: string
  preferences: MultiselectQuestion[]
  setPreferences: (multiselectQuestions: MultiselectQuestion[]) => void
  programs: MultiselectQuestion[]
  setPrograms: (multiselectQuestions: MultiselectQuestion[]) => void
}

const ProgramsAndPreferences = ({
  disableListingPreferences,
  swapCommunityTypeWithPrograms,
  enableV2MSQ,
  listing,
  jurisdiction,
  preferences,
  setPreferences,
  programs,
  setPrograms,
}: ProgramsAndPreferencesProps) => {
  const programComponent = !swapCommunityTypeWithPrograms ? (
    <SelectAndOrder
      enableV2MSQ={enableV2MSQ}
      addText={t("listings.addProgram")}
      applicationSection={MultiselectQuestionsApplicationSectionEnum.programs}
      drawerButtonText={t("listings.selectPrograms")}
      drawerButtonId="select-programs-button"
      drawerTitle={t("listings.addPrograms")}
      editText={t("listings.editPrograms")}
      formKey={"program"}
      jurisdiction={jurisdiction}
      listingData={programs || []}
      setListingData={setPrograms}
      subtitle={t("listings.sections.housingProgramsSubtext")}
      title={t("listings.sections.housingProgramsTitle")}
    />
  ) : (
    <SelectAndOrder
      enableV2MSQ={enableV2MSQ}
      addText={t("listings.addCommunityTypes")}
      applicationSection={MultiselectQuestionsApplicationSectionEnum.programs}
      drawerButtonText={t("listings.selectCommunityTypes")}
      drawerButtonId="select-community-types-button"
      drawerTitle={t("listings.addCommunityTypes")}
      editText={t("listings.editCommunities")}
      formKey={"program"}
      jurisdiction={jurisdiction}
      listingData={programs || []}
      setListingData={setPrograms}
      subNote={`${t("listing.choosePopulations")}.`}
      subtitle={t("listings.sections.communityType.tellUs")}
      title={t("t.communityTypes")}
    />
  )

  return (
    <>
      {!disableListingPreferences && (
        <SelectAndOrder
          enableV2MSQ={enableV2MSQ}
          addText={t("listings.addPreference")}
          applicationSection={MultiselectQuestionsApplicationSectionEnum.preferences}
          drawerButtonText={t("listings.selectPreferences")}
          drawerButtonId="select-preferences-button"
          drawerSubtitle={
            process.env.showLottery && listing?.lotteryOptIn
              ? t("listings.lotteryPreferenceSubtitle")
              : null
          }
          drawerTitle={t("listings.addPreferences")}
          editText={t("listings.editPreferences")}
          formKey={"preference"}
          jurisdiction={jurisdiction}
          listingData={preferences || []}
          setListingData={setPreferences}
          subtitle={t("listings.sections.housingPreferencesSubtext")}
          title={t("listings.sections.housingPreferencesTitle")}
        />
      )}
      {programComponent}
    </>
  )
}

export default ProgramsAndPreferences
