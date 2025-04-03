import React, { useContext } from "react"
import { useFormContext } from "react-hook-form"
import { AuthContext } from "@bloom-housing/shared-helpers"
import {
  FeatureFlagEnum,
  MultiselectQuestion,
  MultiselectQuestionsApplicationSectionEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { t } from "@bloom-housing/ui-components"
import SelectAndOrder from "./SelectAndOrder"
import { useJurisdictionalMultiselectQuestionList } from "../../../../lib/hooks"
import { FormListing } from "../../../../lib/listings/formTypes"

type ProgramsAndPreferencesProps = {
  listing?: FormListing
  preferences: MultiselectQuestion[]
  setPreferences: (multiselectQuestions: MultiselectQuestion[]) => void
  programs: MultiselectQuestion[]
  setPrograms: (multiselectQuestions: MultiselectQuestion[]) => void
}

const ProgramsAndPreferences = ({
  listing,
  preferences,
  setPreferences,
  programs,
  setPrograms,
}: ProgramsAndPreferencesProps) => {
  const formMethods = useFormContext()
  const { doJurisdictionsHaveFeatureFlagOn } = useContext(AuthContext)

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { watch } = formMethods
  const jurisdiction = watch("jurisdictions.id")

  const swapCommunityTypeWithPrograms = doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.swapCommunityTypeWithPrograms,
    jurisdiction
  )

  return (
    <>
      <SelectAndOrder
        addText={t("listings.addPreference")}
        drawerTitle={t("listings.addPreferences")}
        drawerSubtitle={
          process.env.showLottery && listing?.lotteryOptIn
            ? t("listings.lotteryPreferenceSubtitle")
            : null
        }
        editText={t("listings.editPreferences")}
        listingData={preferences || []}
        setListingData={setPreferences}
        subtitle={t("listings.sections.housingPreferencesSubtext")}
        title={t("listings.sections.housingPreferencesTitle")}
        drawerButtonText={t("listings.selectPreferences")}
        dataFetcher={useJurisdictionalMultiselectQuestionList}
        formKey={"preference"}
        applicationSection={MultiselectQuestionsApplicationSectionEnum.preferences}
      />
      <SelectAndOrder
        addText={
          !swapCommunityTypeWithPrograms
            ? t("listings.addProgram")
            : t("listings.addCommunityTypes")
        }
        drawerTitle={
          !swapCommunityTypeWithPrograms
            ? t("listings.addPrograms")
            : t("listings.addCommunityTypes")
        }
        editText={
          !swapCommunityTypeWithPrograms
            ? t("listings.editPrograms")
            : t("listings.editCommunities")
        }
        listingData={programs || []}
        setListingData={setPrograms}
        subtitle={
          !swapCommunityTypeWithPrograms
            ? t("listings.sections.housingProgramsSubtext")
            : t("listings.sections.communityType.tellUs")
        }
        title={
          !swapCommunityTypeWithPrograms
            ? t("listings.sections.housingProgramsTitle")
            : t("listings.reservedCommunityTypes")
        }
        drawerButtonText={
          !swapCommunityTypeWithPrograms
            ? t("listings.selectPrograms")
            : t("listings.selectCommunityTypes")
        }
        dataFetcher={useJurisdictionalMultiselectQuestionList}
        formKey={"program"}
        applicationSection={MultiselectQuestionsApplicationSectionEnum.programs}
        subNote={!swapCommunityTypeWithPrograms ? "" : `${t("listing.choosePopulations")}.`}
      />
    </>
  )
}

export default ProgramsAndPreferences
