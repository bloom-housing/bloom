import { t } from "@bloom-housing/ui-components"
import Markdown from "markdown-to-jsx"
import Link from "next/link"
import { FaqCategory, FaqContent } from "../patterns/FrequentlyAskedQuestions"

export const getJurisdictionFaqContent = (): FaqContent => {
  const howToPrepare: FaqCategory = {
    title: t("faq.processPreparation"),
    faqs: [
      {
        question: t("faq.neededIdentification"),
        answer: (
          <div>
            <b>{t("faq.neededIdentificationResp1")}</b>
            <br />
            {t("faq.neededIdentificationResp2")}
            <br />
            <br />
            <b>
              <Markdown>{t("faq.neededIdentificationResp3")}</Markdown>
            </b>
            <br />
            <Markdown>{t("faq.neededIdentificationResp4")}</Markdown>
            <ul>
              <li>{t("faq.neededIdentificationResp4a")}</li>
              <li>{t("faq.neededIdentificationResp4b")}</li>
            </ul>
            <br />
            {t("faq.neededIdentificationResp5")}
            <ul>
              <li>{t("faq.neededIdentificationResp5a")}</li>
              <li>{t("faq.neededIdentificationResp5b")}</li>
            </ul>
          </div>
        ),
      },
      {
        question: t("faq.paperwork"),
        answer: (
          <>
            {t("faq.paperworkResp")}
            <br />
            <br />
            <b>{t("faq.paperworkRespIncomeTitle")}</b>
            <br />
            {t("faq.paperworkRespIncomeHeader")}
            <ul>
              <li>{t("faq.paperworkRespIncome1")}</li>
              <li>{t("faq.paperworkRespIncome2")}</li>
              <li>{t("faq.paperworkRespIncome3")}</li>
              <li>{t("faq.paperworkRespIncome4")}</li>
              <li>{t("faq.paperworkRespIncome5")}</li>
              <li>{t("faq.paperworkRespIncome6")}</li>
            </ul>
            <br />
            <b>{t("faq.paperworkRespExpensesTitle")}</b>
            <ul>
              <li>{t("faq.paperworkRespExpenses1")}</li>
              <li>{t("faq.paperworkRespExpenses2")}</li>
              <li>{t("faq.paperworkRespExpenses3")}</li>
              <li>{t("faq.paperworkRespExpenses4")}</li>
            </ul>
          </>
        ),
      },
      {
        question: t("faq.householdSizeIncome"),
        answer: (
          <>
            <b>{t("faq.householdSizeIncomeResp1")}</b>
            <br />
            {t("faq.householdSizeIncomeResp2")}
            <br />
            <br />
            <b>{t("faq.householdSizeIncomeResp3")}</b>
            <br />
            {t("faq.householdSizeIncomeResp4")}
          </>
        ),
      },
      {
        question: t("faq.sizeUnit"),
        answer: (
          <>
            <b>{t("faq.sizeUnitResp1")}</b>
            <br />
            {t("faq.sizeUnitResp2")}
            <ul>
              <li>{t("faq.sizeUnitResp3")}</li>
              <li>{t("faq.sizeUnitResp4")}</li>
              <li>{t("faq.sizeUnitResp5")}</li>
            </ul>
          </>
        ),
      },
      {
        question: t("faq.improveChances"),
        answer: (
          <>
            <ul>
              <li>{t("faq.improveChancesResp1")}</li>
              <li>{t("faq.improveChancesResp2")}</li>
              <li>
                {t("faq.improveChancesResp3")}
                <Link href={"https://www.debt.org/credit/improving-your-score/"}>
                  {t("faq.improveChancesResp4")}
                </Link>
              </li>
              <li>{t("faq.improveChancesResp5")}</li>
              <li>
                <Link href={"https://public.govdelivery.com/accounts/CAMTC/signup/36832"}>
                  {t("faq.improveChancesResp6")}
                </Link>
                {t("faq.improveChancesResp7")}
              </li>
            </ul>
          </>
        ),
      },
      {
        question: t("faq.setAside"),
        answer: (
          <>
            {t("faq.setAsideResp1")}
            <ul>
              <li>{t("faq.setAsideResp2")}</li>
              <li>{t("faq.setAsideResp3")}</li>
              <li>{t("faq.setAsideResp4")}</li>
              <li>{t("faq.setAsideResp5")}</li>
            </ul>
            {t("faq.setAsideResp6")}
            <br />
            <br />
            {t("faq.setAsideResp7")}
          </>
        ),
      },
    ],
  }

  const afterIApply: FaqCategory = {
    title: t("faq.whatsNextHeader"),
    faqs: [
      {
        question: t("faq.selections"),
        answer: (
          <>
            {t("faq.selectionsResp")}
            <ul>
              <li>
                <b>{t("faq.selectionsResp1")}</b>
                {t("faq.selectionsResp1b")}
              </li>
              <li>
                <b>{t("faq.selectionsResp2")}</b>
                {t("faq.selectionsResp2b")}
              </li>
            </ul>
          </>
        ),
      },
      {
        question: t("faq.longProcess"),
        answer: (
          <>
            {t("faq.longProcessResp1")}
            <br />
            <br />
            {t("faq.longProcessResp2")}
            <ul>
              <li>{t("faq.longProcessResp3")}</li>
              <li>{t("faq.longProcessResp4")}</li>
              <li>{t("faq.longProcessResp5")}</li>
            </ul>
            <br />
            {t("faq.longProcessResp6")}
            <br />
            <br />
            {t("faq.longProcessResp7")}
          </>
        ),
      },
      {
        question: t("faq.selected"),
        answer: (
          <>
            {t("faq.selectedResp1")}
            <ul>
              <li>{t("faq.selectedResp2")}</li>
              <li>{t("faq.selectedResp3")}</li>
            </ul>
          </>
        ),
      },
      {
        question: t("faq.remainEligible"),
        answer: (
          <>
            <ul>
              <li>{t("faq.remainEligibleResp1")}</li>
              <li>{t("faq.remainEligibleResp2")}</li>
            </ul>
          </>
        ),
      },
    ],
  }

  const whatElseToKnow: FaqCategory = {
    title: t("faq.whatElseToKnowHeader"),
    faqs: [
      {
        question: t("faq.whatMakesAffordable"),
        answer: (
          <>
            {t("faq.whatMakesAffordableResp")}
            <ul>
              <li>
                <b>{t("faq.whatMakesAffordableResp1")}</b>
                {t("faq.whatMakesAffordableResp1b")}
              </li>
              <li>
                <b>{t("faq.whatMakesAffordableResp2")}</b>
                {t("faq.whatMakesAffordableResp2b")}
              </li>
            </ul>
            <br />
            {t("faq.whatMakesAffordableResp3")}
            <br />
            <br />
            {t("faq.whatMakesAffordableResp4")}
            <ul>
              <li>{t("faq.whatMakesAffordableResp5")}</li>
              <li>{t("faq.whatMakesAffordableResp6")}</li>
              <li>{t("faq.whatMakesAffordableResp7")}</li>
              <li>{t("faq.whatMakesAffordableResp8")}</li>
              <li>{t("faq.whatMakesAffordableResp9")}</li>
            </ul>
          </>
        ),
      },
      {
        question: t("faq.incomeAffect"),
        answer: (
          <>
            {t("faq.incomeAffectResp1")}
            <br />
            <br />
            {t("faq.incomeAffectResp2")}
            <Link href={"https://www.huduser.gov/portal/datasets/il.html"}>
              {t("faq.incomeAffectResp3")}
            </Link>
            {t("faq.incomeAffectResp4")}
            <br />
            <br />
            {t("faq.incomeAffectResp5")}
            <ul>
              <li>{t("faq.incomeAffectResp6")}</li>
              <li>{t("faq.incomeAffectResp7")}</li>
            </ul>
          </>
        ),
      },
      {
        question: t("faq.section8VoucherDiff"),
        answer: <>{t("faq.section8VoucherDiffResp")}</>,
      },
      {
        question: t("faq.scammed"),
        answer: (
          <>
            {t("faq.scammedResp")}
            <ul>
              <li>{t("faq.scammedResp1")}</li>
              <li>{t("faq.scammedResp2")}</li>
            </ul>
            <br />
            {t("faq.scammedResp3")}
            <Link href={"https://consumer.ftc.gov/articles/rental-listing-scams"}>
              {t("faq.scammedResp4")}
            </Link>
            {t("faq.scammedResp5")}
          </>
        ),
      },
    ],
  }
  const lotteryResults: FaqCategory = {
    title: t("faq.lotteryResults"),
    faqs: [
      {
        question: t("faq.lotteryResults.rawRank"),
        answer: <>{t("faq.lotteryResults.rawRankResp1")}</>,
      },
      {
        question: t("faq.lotteryResults.preferences"),
        answer: (
          <>
            {t("faq.lotteryResults.preferencesResp1")}
            <br />
            <br />
            {t("faq.lotteryResults.preferencesResp2")}
          </>
        ),
      },
      {
        question: t("faq.lotteryResults.order"),
        answer: (
          <>
            {t("faq.lotteryResults.orderResp1")}
            <br />
            <br />
            {t("faq.lotteryResults.orderResp2")}
            <ul>
              <li>{t("faq.lotteryResults.orderList1")}</li>
              <li>{t("faq.lotteryResults.orderList2")}</li>
              <li>{t("faq.lotteryResults.orderList3")}</li>
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
