import React from "react"
import {
  MultiselectQuestion,
  MultiselectQuestionsApplicationSectionEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { t } from "@bloom-housing/ui-components"
import SelectAndOrder from "./SelectAndOrder"
import { useJurisdictionalMultiselectQuestionList } from "../../../../lib/hooks"
import { FormListing } from "../../../../lib/listings/formTypes"

type ProgramsAndPreferencesProps = {
  disableListingPreferences?: boolean
  swapCommunityTypeWithPrograms?: boolean
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
  listing,
  jurisdiction,
  preferences,
  setPreferences,
  programs,
  setPrograms,
}: ProgramsAndPreferencesProps) => {
  const programComponent = !swapCommunityTypeWithPrograms ? (
    <SelectAndOrder
      addText={t("listings.addProgram")}
      applicationSection={MultiselectQuestionsApplicationSectionEnum.programs}
      dataFetcher={useJurisdictionalMultiselectQuestionList}
      drawerButtonText={t("listings.selectPrograms")}
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
      addText={t("listings.addCommunityTypes")}
      applicationSection={MultiselectQuestionsApplicationSectionEnum.programs}
      dataFetcher={useJurisdictionalMultiselectQuestionList}
      drawerButtonText={t("listings.selectCommunityTypes")}
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
          addText={t("listings.addPreference")}
          applicationSection={MultiselectQuestionsApplicationSectionEnum.preferences}
          dataFetcher={useJurisdictionalMultiselectQuestionList}
          drawerButtonText={t("listings.selectPreferences")}
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
