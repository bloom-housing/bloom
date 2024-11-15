import React from "react"
import Markdown from "markdown-to-jsx"
import { t, Heading } from "@bloom-housing/ui-components"
import { CardProps, Card } from "@bloom-housing/doorway-ui-components"
import { DoorwayCollapsibleSection } from "../components/shared/DoorwayCollapsibleSection"

// These are static, however they need to be exported as a function and
// not a const due to a race condition around translations.
export function getStartedLinkableCards(): React.ReactElement<CardProps>[] {
  return [
    <Card
      className="border-0"
      key="get-started-how-to-start"
      jumplinkData={{ title: t("help.getStarted.howDoIGetStarted") }}
    >
      <Card.Header>
        <Heading priority={2} className={"text-primary-lighter font-bold"}>
          {t("help.getStarted.howDoIGetStarted")}
        </Heading>
      </Card.Header>
      <Card.Section>
        <DoorwayCollapsibleSection title={t("help.getStarted.howDoorwayCanHelp")}>
          {t("help.getStarted.howDoorwayCanHelpResp")}
        </DoorwayCollapsibleSection>
        <DoorwayCollapsibleSection title={t("help.getStarted.iNeedMoreHelp")}>
          <span>
            {t("help.getStarted.iNeedMoreHelpResp")}
            <a href="/help/housing-help">{t("help.getStarted.iNeedMoreHelpRespLink")}</a>.
            <br />
            <br />
            {t("help.getStarted.iNeedMoreHelpRespTip")}
          </span>
        </DoorwayCollapsibleSection>
      </Card.Section>
    </Card>,
    <Card
      className="border-0"
      key="get-started-find-apply"
      jumplinkData={{ title: t("help.getStarted.howFindApply") }}
    >
      <Card.Header>
        <Heading priority={2} className={"text-primary-lighter font-bold"}>
          {t("help.getStarted.howFindApply")}
        </Heading>
      </Card.Header>
      <Card.Section>
        <DoorwayCollapsibleSection title={t("help.getStarted.seeDoorwayListings")}>
          <span>
            {t("help.getStarted.seeDoorwayListingsResp")}
            <span className="text__medium-weighted">{t("nav.viewListings")}</span>
            {t("help.getStarted.seeDoorwayListingsResp1")}
          </span>
        </DoorwayCollapsibleSection>
        <DoorwayCollapsibleSection title={t("help.getStarted.seeListingsHousehold")}>
          <span>
            <ol className="text__medium-normal numbered-list-small ml-5">
              <li>{t("help.getStarted.seeListingsHouseholdResp1")}</li>
              <li>{t("help.getStarted.seeListingsHouseholdResp2")}</li>
              <ul className="text__medium-normal list-disc ml-5 mb-0">
                <li>{t("help.getStarted.seeListingsHouseholdResp2a")}</li>
                <li>{t("help.getStarted.seeListingsHouseholdResp2b")}</li>
                <li>{t("help.getStarted.seeListingsHouseholdResp2c")}</li>
                <li>{t("help.getStarted.seeListingsHouseholdResp2note")}</li>
              </ul>
              <li>{t("help.getStarted.seeListingsHouseholdResp3")}</li>
            </ol>
          </span>
        </DoorwayCollapsibleSection>
        <DoorwayCollapsibleSection title={t("help.getStarted.applyLotteryWaitlist")}>
          <span>
            <ol className="text__medium-normal numbered-list-small ml-5">
              <li>{t("help.getStarted.applyLotteryWaitlistResp1")}</li>
              <li>
                {t("help.getStarted.applyLotteryWaitlistResp2")}
                <span className="text__medium-weighted">{t("t.seeDetails")}</span>.
                {t("help.getStarted.applyLotteryWaitlistResp2a")}
              </li>
              <li>
                {t("help.getStarted.applyLotteryWaitlistResp3")}
                <ul className="text__medium-normal list-disc ml-5 mb-0">
                  <li>{t("help.getStarted.applyLotteryWaitlistResp3a")}</li>
                  <li>{t("help.getStarted.applyLotteryWaitlistResp3b")}</li>
                  <li>{t("help.getStarted.applyLotteryWaitlistResp3d")}</li>
                </ul>
              </li>
              <li>{t("help.getStarted.applyLotteryWaitlistResp4")}</li>
              <li>{t("help.getStarted.applyLotteryWaitlistResp5")}</li>
              <Markdown
                options={{
                  overrides: {
                    ul: {
                      component: ({ children, ...props }) => (
                        <ul {...props} className="list-disc ml-5">
                          {children}
                        </ul>
                      ),
                    },
                  },
                }}
              >
                {t("help.getStarted.applyLotteryWaitlistResp6")}
              </Markdown>
              <li>{t("help.getStarted.applyLotteryWaitlistResp7")}</li>
            </ol>
          </span>
        </DoorwayCollapsibleSection>
        <DoorwayCollapsibleSection title={t("help.getStarted.checkApplications")}>
          <span>
            {t("help.getStarted.checkApplicationsResp")}
            <br />
            <br />
            {t("help.getStarted.checkApplicationsResp1")}
            <ul className="text__medium-normal list-disc ml-5">
              <li>
                <a href="https://housing.acgov.org" target="_blank">
                  {t("help.getStarted.checkApplicationsResp2")}
                </a>
              </li>
              <li>
                <a href="https://housing.sanjoseca.gov" target="_blank">
                  {t("help.getStarted.checkApplicationsResp3")}
                </a>
              </li>
            </ul>
          </span>
        </DoorwayCollapsibleSection>
      </Card.Section>
    </Card>,
  ]
}
