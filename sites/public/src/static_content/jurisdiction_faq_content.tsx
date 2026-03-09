import Markdown from "markdown-to-jsx"
import { FaqCategory, FaqContent } from "../patterns/FrequentlyAskedQuestions"
import { t } from "@bloom-housing/ui-components"

export const getJurisdictionFaqContent = (): FaqContent => {
  const renderMD = (key: string) => (
    <Markdown options={{ disableParsingRawHTML: true }}>{t(key)}</Markdown>
  )

  const howShouldIPrepareForTheProcessSection: FaqCategory = {
    title: t("faq.howShouldIPrepareForTheProcessHeader"),
    faqs: [
      {
        question: t("faq.whatIdentificationWillINeed"),
        answer: renderMD("faq.whatIdentificationWillINeedAnswer"),
      },
      {
        question: t("faq.whatOtherPaperwork"),
        answer: renderMD("faq.whatOtherPaperworkAnswer"),
      },
      {
        question: t("faq.howDoIDetermineMyHouseholdSize"),
        answer: renderMD("faq.howDoIDetermineMyHouseholdSizeAnswer"),
      },
      {
        question: t("faq.whatSizeUnitShouldIApply"),
        answer: renderMD("faq.whatSizeUnitShouldIApplyAnswer"),
      },
      {
        question: t("faq.howCanImproveMyChancesOfGettingHousing"),
        answer: renderMD("faq.howCanImproveMyChancesOfGettingHousingAnswer"),
      },
      {
        question: t("faq.areSomeUnitsSetAsideForParticularCommunities"),
        answer: renderMD("faq.areSomeUnitsSetAsideForParticularCommunitiesAnswer"),
      },
    ],
  }
  const afterIApplyWhatNextSection: FaqCategory = {
    title: t("faq.afterIApplyWhatNextHeader"),
    faqs: [
      {
        question: t("faq.howDoPropertyManagersMakeTheirSelections"),
        answer: renderMD("faq.howDoPropertyManagersMakeTheirSelectionsAnswer"),
      },
      {
        question: t("faq.howLongDoesTheProcessTake"),
        answer: renderMD("faq.howLongDoesTheProcessTakeAnswer"),
      },
      {
        question: t("faq.whatHappensIfImSelected"),
        answer: renderMD("faq.whatHappensIfImSelectedAnswer"),
      },
      {
        question: t("faq.onceIveBeenPlacedInAnAffordableUnitHowDoIRemainEligible"),
        answer: renderMD("faq.onceIveBeenPlacedInAnAffordableUnitHowDoIRemainEligibleAnswer"),
      },
    ],
  }

  const whatElseShouldIKnowAboutAffordableHousingSection: FaqCategory = {
    title: t("faq.whatElseShouldIKnowAboutAffordableHousingHeader"),
    faqs: [
      {
        question: t("faq.whatMakesHousingAffordable"),
        answer: renderMD("faq.whatMakesHousingAffordableAnswer"),
      },
      {
        question: t("faq.howDoesMyIncomeAffectTheRentIPay"),
        answer: renderMD("faq.howDoesMyIncomeAffectTheRentIPayAnswer"),
      },
      {
        question: t("faq.whatIsTheDifferenceBetweenSection8AndHousingChoiceVouchers"),
        answer: t("faq.whatIsTheDifferenceBetweenSection8AndHousingChoiceVouchersAnswer"),
      },
      {
        question: t("faq.howCanITellIfImBeingScammed"),
        answer: renderMD("faq.howCanITellIfImBeingScammedAnswer"),
      },
      {
        question: t("faq.whatAgeRestrictionsAreApplicableToSeniorDevelopments"),
        answer: t("faq.whatAgeRestrictionsAreApplicableToSeniorDevelopmentsAnswer"),
      },
      {
        question: t("faq.areSomeUnitsSetAsideForPersonsThatHaveMobility"),
        answer: t("faq.areSomeUnitsSetAsideForPersonsThatHaveMobilityAnswer"),
      },
      {
        question: t("faq.howDoIGetSection8Housing"),
        answer: renderMD("faq.howDoIGetSection8HousingAnswer"),
      },
      {
        question: t("faq.howDoIKnowIfIHaveADisability"),
        answer: renderMD("faq.howDoIKnowIfIHaveADisabilityAnswer"),
      },
      {
        question: t("faq.whatQuestionsCanBeAskedToProveADisability"),
        answer: t("faq.whatQuestionsCanBeAskedToProveADisabilityAnswer"),
      },
      {
        question: t("faq.ifIveBeenDiscriminatedAgainstWhatShouldIDo"),
        answer: renderMD("faq.ifIveBeenDiscriminatedAgainstWhatShouldIDoAnswer"),
      },
      {
        question: t("faq.whatIfIHaveACommunicationBarrier"),
        answer: renderMD("faq.whatIfIHaveACommunicationBarrierAnswer"),
      },
      {
        question: t("faq.canApropertyAdoptANoPetPolicy"),
        answer: t("faq.canApropertyAdoptANoPetPolicyAnswer"),
      },
      {
        question: t("faq.whatIsAReasonableModification"),
        answer: t("faq.whatIsAReasonableModificationAnswer"),
      },
      {
        question: t("faq.howDoIRequestAReasonableModification"),
        answer: renderMD("faq.howDoIRequestAReasonableModificationAnswer"),
      },
      {
        question: t("faq.areApplicantsWithADIsabilityTreatedDifferently"),
        answer: renderMD("faq.areApplicantsWithADIsabilityTreatedDifferentlyAnswer"),
      },
      {
        question: t("faq.imExperiencingHomelessness"),
        answer: renderMD("faq.imExperiencingHomelessnessAnswer"),
      },
    ],
  }

  return {
    categories: [
      howShouldIPrepareForTheProcessSection,
      afterIApplyWhatNextSection,
      whatElseShouldIKnowAboutAffordableHousingSection,
    ],
  }
}
