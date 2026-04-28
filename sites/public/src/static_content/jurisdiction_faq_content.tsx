import Markdown from "markdown-to-jsx"
import { FaqCategory, FaqContent } from "../patterns/FrequentlyAskedQuestions"
import { t } from "@bloom-housing/ui-components"
import Link from "next/link"

export const getJurisdictionFaqContent = (): FaqContent => {
  const faqContentSection: FaqCategory = {
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
            <Markdown>{t("help.faq.neededIdentificationResp5")}</Markdown>
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

  return {
    categories: [faqContentSection],
  }
}
