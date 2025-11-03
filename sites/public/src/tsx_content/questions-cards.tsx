import React from "react"
import { t, Heading } from "@bloom-housing/ui-components"
import { CardProps, Card } from "@bloom-housing/doorway-ui-components"
import { DoorwayCollapsibleSection } from "../components/shared/DoorwayCollapsibleSection"

// These are static, however they need to be exported as a function and
// not a const due to a race condition around translations.
export function questionsLinkableCards(): React.ReactElement<CardProps>[] {
  const questions = [
    <Card
      className="border-0"
      key="preparation"
      jumplinkData={{ title: t("help.faq.processPreparation") }}
    >
      <Card.Header>
        <Heading priority={2} className={"text-primary-lighter font-bold"}>
          {t("help.faq.processPreparation")}
        </Heading>
      </Card.Header>
      <Card.Section>
        <DoorwayCollapsibleSection title={t("help.faq.neededIdentification")}>
          <span>
            <span className="text__medium-weighted">{t("help.faq.neededIdentificationResp1")}</span>
            <br />
            {t("help.faq.neededIdentificationResp2")}
            <br />
            <br />
            <span className="text__medium-weighted">{t("help.faq.neededIdentificationResp3")}</span>
            <br />
            {t("help.faq.neededIdentificationResp4")}
            <ul className="text__medium-normal list-disc ml-5">
              <li>{t("help.faq.neededIdentificationResp4a")}</li>
              <li>{t("help.faq.neededIdentificationResp4b")}</li>
            </ul>
            {t("help.faq.neededIdentificationResp5")}
            <ul className="text__medium-normal list-disc ml-5">
              <li>{t("help.faq.neededIdentificationResp5a")}</li>
              <li>{t("help.faq.neededIdentificationResp5b")}</li>
            </ul>
          </span>
        </DoorwayCollapsibleSection>
        <DoorwayCollapsibleSection title={t("help.faq.paperwork")}>
          <span>
            {t("help.faq.paperworkResp")}
            <br />
            <br />
            <span className="text__medium-weighted">{t("help.faq.paperworkRespIncomeTitle")}</span>
            <br />
            {t("help.faq.paperworkRespIncomeHeader")}
            <br />
            <ul className="text__medium-normal list-disc ml-5">
              <li>{t("help.faq.paperworkRespIncome1")}</li>
              <li>{t("help.faq.paperworkRespIncome2")}</li>
              <li>{t("help.faq.paperworkRespIncome3")}</li>
              <li>{t("help.faq.paperworkRespIncome4")}</li>
              <li>{t("help.faq.paperworkRespIncome5")}</li>
              <li>{t("help.faq.paperworkRespIncome6")}</li>
            </ul>
            <span className="text__medium-weighted">
              {t("help.faq.paperworkRespExpensesTitle")}
            </span>
            <br />
            <ul className="text__medium-normal list-disc ml-5">
              <li>{t("help.faq.paperworkRespExpenses1")}</li>
              <li>{t("help.faq.paperworkRespExpenses2")}</li>
              <li>{t("help.faq.paperworkRespExpenses3")}</li>
              <li>{t("help.faq.paperworkRespExpenses4")}</li>
            </ul>
          </span>
        </DoorwayCollapsibleSection>
        <DoorwayCollapsibleSection title={t("help.faq.householdSizeIncome")}>
          <span>
            <span className="text__medium-weighted">{t("help.faq.householdSizeIncomeResp1")}</span>
            <br />
            {t("help.faq.householdSizeIncomeResp2")}
            <br />
            <br />
            <span className="text__medium-weighted">{t("help.faq.householdSizeIncomeResp3")}</span>
            <br />
            {t("help.faq.householdSizeIncomeResp4")}
          </span>
        </DoorwayCollapsibleSection>
        <DoorwayCollapsibleSection title={t("help.faq.sizeUnit")}>
          <span>
            <span className="text__medium-weighted">{t("help.faq.sizeUnitResp1")}</span>
            <br />
            {t("help.faq.sizeUnitResp2")}
            <br />
            <ul className="text__medium-normal list-disc ml-5">
              <li>{t("help.faq.sizeUnitResp3")}</li>
              <li>{t("help.faq.sizeUnitResp4")}</li>
              <li>{t("help.faq.sizeUnitResp5")}</li>
            </ul>
          </span>
        </DoorwayCollapsibleSection>
        <DoorwayCollapsibleSection title={t("help.faq.improveChances")}>
          <span>
            <ul className="text__medium-normal list-disc ml-5">
              <li>{t("help.faq.improveChancesResp1")}</li>
              <li>{t("help.faq.improveChancesResp2")}</li>
              <li>
                {t("help.faq.improveChancesResp3")}
                <a href="https://www.debt.org/credit/improving-your-score/" target="_blank">
                  {t("help.faq.improveChancesResp4")}
                </a>
              </li>
              <li>{t("help.faq.improveChancesResp5")}</li>
              <li>
                <a
                  href="https://public.govdelivery.com/accounts/CAMTC/signup/36832"
                  target="_blank"
                >
                  {t("help.faq.improveChancesResp6")}
                </a>
                {t("help.faq.improveChancesResp7")}
              </li>
            </ul>
          </span>
        </DoorwayCollapsibleSection>
        <DoorwayCollapsibleSection title={t("help.faq.setAside")}>
          <span>
            {t("help.faq.setAsideResp1")}
            <ul className="text__medium-normal list-disc ml-5">
              <li>{t("help.faq.setAsideResp2")}</li>
              <li>{t("help.faq.setAsideResp3")}</li>
              <li>{t("help.faq.setAsideResp4")}</li>
              <li>{t("help.faq.setAsideResp5")}</li>
            </ul>
            {t("help.faq.setAsideResp6")}
            <br />
            <br />
            {t("help.faq.setAsideResp7")}
          </span>
        </DoorwayCollapsibleSection>
      </Card.Section>
    </Card>,
    <Card
      className="border-0"
      key="whatsNext"
      jumplinkData={{ title: t("help.faq.whatsNextHeader") }}
    >
      <Card.Header>
        <Heading priority={2} className={"text-primary-lighter font-bold"}>
          {t("help.faq.whatsNextHeader")}
        </Heading>
      </Card.Header>
      <Card.Section>
        <DoorwayCollapsibleSection title={t("help.faq.selections")}>
          <span>
            {t("help.faq.selectionsResp")}
            <ul className="text__medium-normal list-disc ml-5">
              <li>
                <span className="text__medium-weighted">{t("help.faq.selectionsResp1")}</span>
                {t("help.faq.selectionsResp1b")}
              </li>
              <li>
                <span className="text__medium-weighted">{t("help.faq.selectionsResp2")}</span>
                {t("help.faq.selectionsResp2b")}
              </li>
            </ul>
          </span>
        </DoorwayCollapsibleSection>
        <DoorwayCollapsibleSection title={t("help.faq.longProcess")}>
          <span>
            {t("help.faq.longProcessResp1")}
            <br />
            <br />
            {t("help.faq.longProcessResp2")}
            <ul className="text__medium-normal list-disc ml-5">
              <li>{t("help.faq.longProcessResp3")}</li>
              <li>{t("help.faq.longProcessResp4")}</li>
              <li>{t("help.faq.longProcessResp5")}</li>
            </ul>
            {t("help.faq.longProcessResp6")}
            <br />
            <br />
            {t("help.faq.longProcessResp7")}
          </span>
        </DoorwayCollapsibleSection>
        <DoorwayCollapsibleSection title={t("help.faq.selected")}>
          <span>
            {t("help.faq.selectedResp1")}
            <ul className="text__medium-normal list-disc ml-5">
              <li>{t("help.faq.selectedResp2")}</li>
              <li>{t("help.faq.selectedResp3")}</li>
            </ul>
          </span>
        </DoorwayCollapsibleSection>
        <DoorwayCollapsibleSection title={t("help.faq.remainEligible")}>
          <span>
            <ul className="text__medium-normal list-disc ml-5">
              <li>{t("help.faq.remainEligibleResp1")}</li>
              <li>{t("help.faq.remainEligibleResp2")}</li>
            </ul>
          </span>
        </DoorwayCollapsibleSection>
      </Card.Section>
    </Card>,
    <Card
      className="border-0"
      key="whatElseToKnow"
      jumplinkData={{ title: t("help.faq.whatElseToKnowHeader") }}
    >
      <Card.Header>
        <Heading priority={2} className={"text-primary-lighter font-bold"}>
          {t("help.faq.whatElseToKnowHeader")}
        </Heading>
      </Card.Header>
      <Card.Section>
        <DoorwayCollapsibleSection title={t("help.faq.whatMakesAffordable")}>
          <span>
            {t("help.faq.whatMakesAffordableResp")}
            <ul className="text__medium-normal list-disc ml-5">
              <li>
                <span className="text__medium-weighted">
                  {t("help.faq.whatMakesAffordableResp1")}
                </span>
                {t("help.faq.whatMakesAffordableResp1b")}
              </li>
              <li>
                <span className="text__medium-weighted">
                  {t("help.faq.whatMakesAffordableResp2")}
                </span>
                {t("help.faq.whatMakesAffordableResp2b")}
              </li>
            </ul>
            {t("help.faq.whatMakesAffordableResp3")}
            <br />
            <br />
            {t("help.faq.whatMakesAffordableResp4")}
            <ul className="text__medium-normal list-disc ml-5">
              <li>{t("help.faq.whatMakesAffordableResp5")}</li>
              <li>{t("help.faq.whatMakesAffordableResp6")}</li>
              <li>{t("help.faq.whatMakesAffordableResp7")}</li>
              <li>{t("help.faq.whatMakesAffordableResp8")}</li>
              <li>{t("help.faq.whatMakesAffordableResp9")}</li>
            </ul>
          </span>
        </DoorwayCollapsibleSection>
        <DoorwayCollapsibleSection title={t("help.faq.incomeAffect")}>
          <span>
            {t("help.faq.incomeAffectResp1")}
            <br />
            <br />
            {t("help.faq.incomeAffectResp2")}
            <a href="https://www.huduser.gov/portal/datasets/il.html" target="_blank">
              {t("help.faq.incomeAffectResp3")}
            </a>
            {t("help.faq.incomeAffectResp4")}
            <br />
            <br />
            {t("help.faq.incomeAffectResp5")}
            <ul className="text__medium-normal list-disc ml-5">
              <li>{t("help.faq.incomeAffectResp6")}</li>
              <li>{t("help.faq.incomeAffectResp7")}</li>
            </ul>
          </span>
        </DoorwayCollapsibleSection>
        <DoorwayCollapsibleSection title={t("help.faq.section8VoucherDiff")}>
          <span>{t("help.faq.section8VoucherDiffResp")}</span>
        </DoorwayCollapsibleSection>
        <DoorwayCollapsibleSection title={t("help.faq.scammed")}>
          <span>
            {t("help.faq.scammedResp")}
            <ul className="text__medium-normal list-disc ml-5">
              <li>{t("help.faq.scammedResp1")}</li>
              <li>{t("help.faq.scammedResp2")}</li>
            </ul>
            {t("help.faq.scammedResp3")}
            <a href="https://consumer.ftc.gov/articles/rental-listing-scams" target="_blank">
              {t("help.faq.scammedResp4")}
            </a>
            {t("help.faq.scammedResp5")}
          </span>
        </DoorwayCollapsibleSection>
      </Card.Section>
    </Card>,
  ]
  if (process.env.showPublicLottery) {
    questions.push(
      <Card
        className="border-0"
        key="lotteryResults"
        jumplinkData={{ title: t("help.faq.lotteryResults") }}
      >
        <Card.Header>
          <Heading priority={2} className={"text-primary-lighter font-bold"}>
            {t("help.faq.lotteryResults")}
          </Heading>
        </Card.Header>
        <Card.Section>
          <DoorwayCollapsibleSection title={t("help.faq.lotteryResults.rawRank")}>
            <span>{t("help.faq.lotteryResults.rawRankResp1")}</span>
          </DoorwayCollapsibleSection>
          <DoorwayCollapsibleSection title={t("help.faq.lotteryResults.preferences")}>
            <span>
              {t("help.faq.lotteryResults.preferencesResp1")}
              <br />
              <br />
              {t("help.faq.lotteryResults.preferencesResp2")}
            </span>
          </DoorwayCollapsibleSection>
          <DoorwayCollapsibleSection title={t("help.faq.lotteryResults.order")}>
            <span>
              {t("help.faq.lotteryResults.orderResp1")}
              <br />
              <br />
              {t("help.faq.lotteryResults.orderResp2")}
              <ul className="text__medium-normal list-disc ml-5">
                <li>{t("help.faq.lotteryResults.orderList1")}</li>
                <li>{t("help.faq.lotteryResults.orderList2")}</li>
                <li>{t("help.faq.lotteryResults.orderList3")}</li>
              </ul>
            </span>
          </DoorwayCollapsibleSection>
          <DoorwayCollapsibleSection title={t("help.faq.lotteryResults.additionalQuestions")}>
            <span>
              {t("help.faq.lotteryResults.additionalQuestionsResp1")}{" "}
              <a href={`mailto:doorway@bayareametro.gov`}>
                {t("help.faq.lotteryResults.additionalQuestionsResp2")}
              </a>{" "}
              {t("help.faq.lotteryResults.additionalQuestionsResp3")}
            </span>
          </DoorwayCollapsibleSection>
        </Card.Section>
      </Card>
    )
  }
  return questions
}
