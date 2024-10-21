import React from "react"
import { t, Heading } from "@bloom-housing/ui-components"
import { CardProps, Card } from "@bloom-housing/doorway-ui-components"
import { DoorwaySection } from "../components/shared/DoorwaySection"

// These are static, however they need to be exported as a function and
// not a const due to a race condition around translations.

export function professionalsPartnersDevelopersCards(): React.ReactElement<CardProps>[] {
  return [
    <Card
      className="border-0"
      key="what-is-the-doorway"
      jumplinkData={{ title: t("professionalPartners.whatIsTheDoorway") }}
    >
      <Card.Header>
        <Heading priority={2} className={"text-primary-lighter font-bold"}>
          {t("professionalPartners.whatIsTheDoorway")}
        </Heading>
      </Card.Header>
      <Card.Section>
        <span>{t("professionalPartners.dev.whatIsTheDoorwayResp1")}</span>
        <br />
        <br />
        <span>{t("professionalPartners.dev.whatIsTheDoorwayResp2")}</span>
        <a href="https://partners.housingbayarea.mtc.ca.gov">
          {t("professionalPartners.dev.whatIsTheDoorwayResp3")}
        </a>
        <DoorwaySection title={t("professionalPartners.dev.whyDoWeNeedDoorway")}>
          {t("professionalPartners.dev.whyDoWeNeedDoorwayResp")}
        </DoorwaySection>
      </Card.Section>
    </Card>,
    <Card
      className="border-0"
      key="what-is-the-role-of-developers"
      jumplinkData={{ title: t("professionalPartners.dev.whatIsTheRoleOfDevelopers") }}
    >
      <Card.Header>
        <Heading priority={2} className={"text-primary-lighter font-bold"}>
          {t("professionalPartners.dev.whatIsTheRoleOfDevelopers")}
        </Heading>
      </Card.Header>
      <Card.Section>
        <span>
          {t("professionalPartners.dev.whatIsTheRoleOfDevelopersResp1")}
          <a href={`mailto:${t("professionalPartners.doorwayEmail")}`}>
            {t("professionalPartners.dev.whatIsTheRoleOfDevelopersResp2")}
          </a>
        </span>
        <DoorwaySection title={t("professionalPartners.dev.whatAreTheBenefitsOfDevelopers")}>
          <ul className="text__medium-normal list-disc ml-5">
            <li>{t("professionalPartners.dev.whatAreTheBenefitsOfDevelopersResp1")}</li>
            <li>{t("professionalPartners.dev.whatAreTheBenefitsOfDevelopersResp2")}</li>
            <li>{t("professionalPartners.dev.whatAreTheBenefitsOfDevelopersResp3")}</li>
            <li>{t("professionalPartners.dev.whatAreTheBenefitsOfDevelopersResp4")}</li>
            <li>{t("professionalPartners.dev.whatAreTheBenefitsOfDevelopersResp5")}</li>
            <li>{t("professionalPartners.dev.whatAreTheBenefitsOfDevelopersResp6")}</li>
            <li>{t("professionalPartners.dev.whatAreTheBenefitsOfDevelopersResp7")}</li>
          </ul>
        </DoorwaySection>
      </Card.Section>
    </Card>,
    <Card
      className="border-0"
      key="how-does-listing-work"
      jumplinkData={{ title: t("professionalPartners.dev.howDoesListingWork") }}
    >
      <Card.Header>
        <Heading priority={2} className={"text-primary-lighter font-bold"}>
          {t("professionalPartners.dev.howDoesListingWork")}
        </Heading>
      </Card.Header>
      <Card.Section>
        <DoorwaySection title={t("professionalPartners.dev.whatKindOfProperties")}>
          {t("professionalPartners.dev.whatKindOfPropertiesResp")}
        </DoorwaySection>
        <DoorwaySection title={t("professionalPartners.dev.howDoWeListProperty")}>
          {t("professionalPartners.dev.howDoWeListPropertyResp1")}
          <ul className="text__medium-normal list-disc ml-5">
            <li>
              {t("professionalPartners.dev.howDoWeListPropertyResp2a")}
              <a href="https://partners.housingbayarea.mtc.ca.gov">
                {t("professionalPartners.dev.howDoWeListPropertyResp2b")}
              </a>
            </li>
            <li>
              {t("professionalPartners.dev.howDoWeListPropertyResp3a")}
              <a href={`mailto:${t("professionalPartners.doorwayEmail")}`}>
                {t("professionalPartners.doorwayEmail")}
              </a>
              {t("professionalPartners.dev.howDoWeListPropertyResp3b")}
            </li>
            <li>
              {t("professionalPartners.dev.howDoWeListPropertyResp4")}
              <ul className="text__medium-normal list-disc ml-5">
                <li>
                  {t("professionalPartners.dev.howDoWeListPropertyResp4a1")}
                  <a href={`mailto:${t("professionalPartners.doorwayEmail")}`}>
                    {t("professionalPartners.doorwayEmail")}
                  </a>
                  {t("professionalPartners.dev.howDoWeListPropertyResp4a2")}
                  <ul className="text__medium-normal list-disc ml-5">
                    <li>{t("professionalPartners.dev.howDoWeListPropertyResp4aInfo")}</li>
                  </ul>
                </li>
                <li>{t("professionalPartners.dev.howDoWeListPropertyResp4b")}</li>
                <li>{t("professionalPartners.dev.howDoWeListPropertyResp4c")}</li>
                <li>
                  {t("professionalPartners.dev.howDoWeListPropertyResp4d1")}
                  <a href={`mailto:${t("professionalPartners.doorwayEmail")}`}>
                    {t("professionalPartners.doorwayEmail")}
                  </a>
                  {t("professionalPartners.dev.howDoWeListPropertyResp4d2")}
                </li>
              </ul>
            </li>
          </ul>
        </DoorwaySection>
        <DoorwaySection title={t("professionalPartners.dev.whatIfIHaveAnAccount")}>
          {t("professionalPartners.dev.whatIfIHaveAnAccountResp1")}
          <ul className="text__medium-normal list-disc ml-5">
            <li>
              {t("professionalPartners.dev.whatIfIHaveAnAccountResp2a")}
              <a href={`mailto:${t("professionalPartners.partnersEmail")}`}>
                {t("professionalPartners.partnersEmail")}
              </a>
              {t("professionalPartners.dev.whatIfIHaveAnAccountResp2b")}
            </li>
          </ul>
        </DoorwaySection>
        <DoorwaySection title={t("professionalPartners.dev.howCanIGetInvolved")}>
          {t("professionalPartners.dev.howCanIGetInvolvedResp1a")}
          <a href={`mailto:${t("professionalPartners.doorwayEmail")}`}>
            {t("professionalPartners.dev.howCanIGetInvolvedResp1b")}
          </a>
        </DoorwaySection>
      </Card.Section>
    </Card>,
  ]
}
