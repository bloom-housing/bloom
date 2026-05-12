import Markdown from "markdown-to-jsx"
import { FaqCategory, FaqContent } from "../patterns/FrequentlyAskedQuestions"
import { t } from "@bloom-housing/ui-components"
import Link from "next/link"

export const getJurisdictionFaqContent = (): FaqContent => {
  const howToPrepare: FaqCategory = {
    title: t("help.faq.processPreparation"),
    faqs: [
      {
        question: t("help.faq.neededIdentification"),
        answer: (
          <div>
            <b>{t("help.faq.neededIdentificationResp1")}</b>
            <br />
            {t("help.faq.neededIdentificationResp2")}
            <br />
            <br />
            <b>
              <Markdown>{t("help.faq.neededIdentificationResp3")}</Markdown>
            </b>
            <br />
            <Markdown>{t("help.faq.neededIdentificationResp4")}</Markdown>
            <ul>
              <li>{t("help.faq.neededIdentificationResp4a")}</li>
              <li>{t("help.faq.neededIdentificationResp4b")}</li>
            </ul>
            <br />
            {t("help.faq.neededIdentificationResp5")}
            <ul>
              <li>{t("help.faq.neededIdentificationResp5a")}</li>
              <li>{t("help.faq.neededIdentificationResp5b")}</li>
            </ul>
          </div>
        ),
      },
      {
        question: t("help.faq.paperwork"),
        answer: (
          <>
            {t("help.faq.paperworkResp")}
            <br />
            <br />
            <b>{t("help.faq.paperworkRespIncomeTitle")}</b>
            <br />
            {t("help.faq.paperworkRespIncomeHeader")}
            <ul>
              <li>{t("help.faq.paperworkRespIncome1")}</li>
              <li>{t("help.faq.paperworkRespIncome2")}</li>
              <li>{t("help.faq.paperworkRespIncome3")}</li>
              <li>{t("help.faq.paperworkRespIncome4")}</li>
              <li>{t("help.faq.paperworkRespIncome5")}</li>
              <li>{t("help.faq.paperworkRespIncome6")}</li>
            </ul>
            <br />
            <b>{t("help.faq.paperworkRespExpensesTitle")}</b>
            <ul>
              <li>{t("help.faq.paperworkRespExpenses1")}</li>
              <li>{t("help.faq.paperworkRespExpenses2")}</li>
              <li>{t("help.faq.paperworkRespExpenses3")}</li>
              <li>{t("help.faq.paperworkRespExpenses4")}</li>
            </ul>
          </>
        ),
      },
      {
        question: t("help.faq.householdSizeIncome"),
        answer: (
          <>
            <b>{t("help.faq.householdSizeIncomeResp1")}</b>
            <br />
            {t("help.faq.householdSizeIncomeResp2")}
            <br />
            <br />
            <b>{t("help.faq.householdSizeIncomeResp3")}</b>
            <br />
            {t("help.faq.householdSizeIncomeResp4")}
          </>
        ),
      },
      {
        question: t("help.faq.sizeUnit"),
        answer: (
          <>
            <b>{t("help.faq.sizeUnitResp1")}</b>
            <br />
            {t("help.faq.sizeUnitResp2")}
            <ul>
              <li>{t("help.faq.sizeUnitResp3")}</li>
              <li>{t("help.faq.sizeUnitResp4")}</li>
              <li>{t("help.faq.sizeUnitResp5")}</li>
            </ul>
          </>
        ),
      },
      {
        question: t("help.faq.improveChances"),
        answer: (
          <>
            <ul>
              <li>{t("help.faq.improveChancesResp1")}</li>
              <li>{t("help.faq.improveChancesResp2")}</li>
              <li>
                {t("help.faq.improveChancesResp3")}
                <Link href={"https://www.debt.org/credit/improving-your-score/"}>
                  {t("help.faq.improveChancesResp4")}
                </Link>
              </li>
              <li>{t("help.faq.improveChancesResp5")}</li>
              <li>
                <Link href={"https://public.govdelivery.com/accounts/CAMTC/signup/36832"}>
                  {t("help.faq.improveChancesResp6")}
                </Link>
                {t("help.faq.improveChancesResp7")}
              </li>
            </ul>
          </>
        ),
      },
      {
        question: t("help.faq.setAside"),
        answer: (
          <>
            {t("help.faq.setAsideResp1")}
            <ul>
              <li>{t("help.faq.setAsideResp2")}</li>
              <li>{t("help.faq.setAsideResp3")}</li>
              <li>{t("help.faq.setAsideResp4")}</li>
              <li>{t("help.faq.setAsideResp5")}</li>
            </ul>
            {t("help.faq.setAsideResp6")}
            <br />
            <br />
            {t("help.faq.setAsideResp7")}
          </>
        ),
      },
    ],
  }

  const afterIApply: FaqCategory = {
    title: t("help.faq.whatsNextHeader"),
    faqs: [
      {
        question: t("help.faq.selections"),
        answer: (
          <>
            {t("help.faq.selectionsResp")}
            <ul>
              <li>
                <b>{t("help.faq.selectionsResp1")}</b>
                {t("help.faq.selectionsResp1b")}
              </li>
              <li>
                <b>{t("help.faq.selectionsResp2")}</b>
                {t("help.faq.selectionsResp2b")}
              </li>
            </ul>
          </>
        ),
      },
      {
        question: t("help.faq.longProcess"),
        answer: (
          <>
            {t("help.faq.longProcessResp1")}
            <br />
            <br />
            {t("help.faq.longProcessResp2")}
            <ul>
              <li>{t("help.faq.longProcessResp3")}</li>
              <li>{t("help.faq.longProcessResp4")}</li>
              <li>{t("help.faq.longProcessResp5")}</li>
            </ul>
            <br />
            {t("help.faq.longProcessResp6")}
            <br />
            <br />
            {t("help.faq.longProcessResp7")}
          </>
        ),
      },
      {
        question: t("help.faq.selected"),
        answer: (
          <>
            {t("help.faq.selectedResp1")}
            <ul>
              <li>{t("help.faq.selectedResp2")}</li>
              <li>{t("help.faq.selectedResp3")}</li>
            </ul>
          </>
        ),
      },
      {
        question: t("help.faq.remainEligible"),
        answer: (
          <>
            <ul>
              <li>{t("help.faq.remainEligibleResp1")}</li>
              <li>{t("help.faq.remainEligibleResp2")}</li>
            </ul>
          </>
        ),
      },
    ],
  }

  const whatElseToKnow: FaqCategory = {
    title: t("help.faq.whatElseToKnowHeader"),
    faqs: [
      {
        question: t("help.faq.whatMakesAffordable"),
        answer: (
          <>
            {t("help.faq.whatMakesAffordableResp")}
            <ul>
              <li>
                <b>{t("help.faq.whatMakesAffordableResp1")}</b>
                {t("help.faq.whatMakesAffordableResp1b")}
              </li>
              <li>
                <b>{t("help.faq.whatMakesAffordableResp2")}</b>
                {t("help.faq.whatMakesAffordableResp2b")}
              </li>
            </ul>
            <br />
            {t("help.faq.whatMakesAffordableResp3")}
            <br />
            <br />
            {t("help.faq.whatMakesAffordableResp4")}
            <ul>
              <li>{t("help.faq.whatMakesAffordableResp5")}</li>
              <li>{t("help.faq.whatMakesAffordableResp6")}</li>
              <li>{t("help.faq.whatMakesAffordableResp7")}</li>
              <li>{t("help.faq.whatMakesAffordableResp8")}</li>
              <li>{t("help.faq.whatMakesAffordableResp9")}</li>
            </ul>
          </>
        ),
      },
      {
        question: t("help.faq.incomeAffect"),
        answer: (
          <>
            {t("help.faq.incomeAffectResp1")}
            <br />
            <br />
            {t("help.faq.incomeAffectResp2")}
            <Link href={"https://www.huduser.gov/portal/datasets/il.html"}>
              {t("help.faq.incomeAffectResp3")}
            </Link>
            {t("help.faq.incomeAffectResp4")}
            <br />
            <br />
            {t("help.faq.incomeAffectResp5")}
            <ul>
              <li>{t("help.faq.incomeAffectResp6")}</li>
              <li>{t("help.faq.incomeAffectResp7")}</li>
            </ul>
          </>
        ),
      },
      {
        question: t("help.faq.section8VoucherDiff"),
        answer: <>{t("help.faq.section8VoucherDiffResp")}</>,
      },
      {
        question: t("help.faq.scammed"),
        answer: (
          <>
            {t("help.faq.scammedResp")}
            <ul>
              <li>{t("help.faq.scammedResp1")}</li>
              <li>{t("help.faq.scammedResp2")}</li>
            </ul>
            <br />
            {t("help.faq.scammedResp3")}
            <Link href={"https://consumer.ftc.gov/articles/rental-listing-scams"}>
              {t("help.faq.scammedResp4")}
            </Link>
            {t("help.faq.scammedResp5")}
          </>
        ),
      },
    ],
  }
  const lotteryResults: FaqCategory = {
    title: t("help.faq.lotteryResults"),
    faqs: [
      {
        question: t("help.faq.lotteryResults.rawRank"),
        answer: <>{t("help.faq.lotteryResults.rawRankResp1")}</>,
      },
      {
        question: t("help.faq.lotteryResults.preferences"),
        answer: (
          <>
            {t("help.faq.lotteryResults.preferencesResp1")}
            <br />
            <br />
            {t("help.faq.lotteryResults.preferencesResp2")}
          </>
        ),
      },
      {
        question: t("help.faq.lotteryResults.order"),
        answer: (
          <>
            {t("help.faq.lotteryResults.orderResp1")}
            <br />
            <br />
            {t("help.faq.lotteryResults.orderResp2")}
            <ul>
              <li>{t("help.faq.lotteryResults.orderList1")}</li>
              <li>{t("help.faq.lotteryResults.orderList2")}</li>
              <li>{t("help.faq.lotteryResults.orderList3")}</li>
            </ul>
          </>
        ),
      },
    ],
  }

  return {
    categories: [howToPrepare, afterIApply, whatElseToKnow, lotteryResults],
  }
}
