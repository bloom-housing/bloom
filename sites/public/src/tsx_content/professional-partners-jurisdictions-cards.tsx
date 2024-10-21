import React from "react"
import { t, Heading } from "@bloom-housing/ui-components"
import { CardProps, Card } from "@bloom-housing/doorway-ui-components"
import { DoorwaySection } from "../components/shared/DoorwaySection"

// These are static, however they need to be exported as a function and
// not a const due to a race condition around translations.
export function professionalsPartnersJurisdictionsCards(): React.ReactElement<CardProps>[] {
  return [
    <Card
      className="border-0"
      key="what-is-the-role"
      jumplinkData={{ title: t("professionalPartners.jurisdictions.whatIsTheRole") }}
    >
      <Card.Header>
        <Heading priority={2} className={"text-primary-lighter font-bold"}>
          {t("professionalPartners.jurisdictions.whatIsTheRole")}
        </Heading>
      </Card.Header>
      <Card.Section>
        <span>
          {t("professionalPartners.jurisdictions.whatIsTheRoleResp1")}
          <a href={`mailto:${t("professionalPartners.doorwayEmail")}`}>
            {t("professionalPartners.jurisdictions.whatIsTheRoleResp2")}
          </a>
        </span>
      </Card.Section>
      <Card.Section>
        <DoorwaySection
          title={t("professionalPartners.jurisdictions.benefitsOfLocalJurisdictions")}
        >
          <ul className="text__medium-normal list-disc ml-5">
            <li>{t("professionalPartners.jurisdictions.benefitsOfLocalJurisdictionsResp1")}</li>
            <li>{t("professionalPartners.jurisdictions.benefitsOfLocalJurisdictionsResp2")}</li>
            <li>{t("professionalPartners.jurisdictions.benefitsOfLocalJurisdictionsResp3")}</li>
            <li>{t("professionalPartners.jurisdictions.benefitsOfLocalJurisdictionsResp4")}</li>
            <li>{t("professionalPartners.jurisdictions.benefitsOfLocalJurisdictionsResp5")}</li>
            <li>{t("professionalPartners.jurisdictions.benefitsOfLocalJurisdictionsResp6")}</li>
            <li>{t("professionalPartners.jurisdictions.benefitsOfLocalJurisdictionsResp7")}</li>
            <li>{t("professionalPartners.jurisdictions.benefitsOfLocalJurisdictionsResp8")}</li>
          </ul>
        </DoorwaySection>
      </Card.Section>
    </Card>,
    <Card
      className="border-0"
      key="how-can-we-get-involved"
      jumplinkData={{ title: t("professionalPartners.jurisdictions.howCanWeGetInvolved") }}
    >
      <Card.Header>
        <Heading priority={2} className={"text-primary-lighter font-bold"}>
          {t("professionalPartners.jurisdictions.howCanWeGetInvolved")}
        </Heading>
      </Card.Header>
      <Card.Section>
        <span>
          {t("professionalPartners.jurisdictions.howCanWeGetInvolvedResp1")}
          <a href={`mailto:${t("professionalPartners.doorwayEmail")}`}>
            {t("professionalPartners.doorwayEmail")}
          </a>
          {t("professionalPartners.jurisdictions.howCanWeGetInvolvedResp2")}
        </span>
      </Card.Section>
    </Card>,
  ]
}
