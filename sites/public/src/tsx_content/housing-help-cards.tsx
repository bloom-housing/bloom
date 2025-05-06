import React from "react"
import { t, Heading } from "@bloom-housing/ui-components"
import { CardProps, Card } from "@bloom-housing/doorway-ui-components"
import { DoorwayCollapsibleSection } from "../components/shared/DoorwayCollapsibleSection"

// These are static, however they need to be exported as a function and
// not a const due to a race condition around translations.
export function housingHelpCardIntro(): React.ReactElement<CardProps> {
  return (
    <Card className="border-0 p-0">
      <Card.Section>{t("help.housingHelp.pageIntro")}</Card.Section>
    </Card>
  )
}

export function housingHelpLinkableCards(): React.ReactElement<CardProps>[] {
  return [
    <Card
      className="border-0"
      key="immediate-housing-assistance"
      jumplinkData={{ title: t("help.housingHelp.immediateHousingAssistance") }}
    >
      <Card.Header>
        <Heading priority={2} className={"text-primary-lighter font-bold"}>
          {t("help.housingHelp.immediateHousingAssistance")}
        </Heading>
      </Card.Header>
      <Card.Section>{t("help.housingHelp.immediateHousingAssistanceHeader")}</Card.Section>
      <Card.Section>
        <DoorwayCollapsibleSection title={t("counties.fullname.Alameda")}>
          <a href="https://www.bayareacs.org/" target="_blank">
            {t("help.housingHelp.immediate.alamedaBACS")}
          </a>
          {t("help.housingHelp.immediate.alamedaBACSinfo")}
          <br />
          <br />
          <a href="https://operationdignity.org/" target="_blank">
            {t("help.housingHelp.immediate.alamedaOD")}
          </a>
          {t("help.housingHelp.immediate.alamedaODinfo")}
        </DoorwayCollapsibleSection>
        <DoorwayCollapsibleSection title={t("counties.fullname.ContraCosta")}>
          <a
            href="https://www.cchealth.org/services-and-programs/homeless-services"
            target="_blank"
          >
            {t("help.housingHelp.immediate.contraCostaCHS")}
          </a>
          {t("help.housingHelp.immediate.contraCostaCHSinfo")}
        </DoorwayCollapsibleSection>
        <DoorwayCollapsibleSection title={t("counties.fullname.Marin")}>
          <a href="https://www.marinhhs.org/resources/Housing" target="_blank">
            {t("help.housingHelp.immediate.marinMCRG")}
          </a>
          {t("help.housingHelp.immediate.marinMCRGinfo")}
        </DoorwayCollapsibleSection>
        <DoorwayCollapsibleSection title={t("counties.fullname.Napa")}>
          <a href="https://www.countyofnapa.org/272/Homeless-Services" target="_blank">
            {t("help.housingHelp.immediate.napaNCHS")}
          </a>
          {t("help.housingHelp.immediate.napaNCHSinfo")}
        </DoorwayCollapsibleSection>
        <DoorwayCollapsibleSection title={t("counties.fullname.SanFrancisco")}>
          <a href="https://sfserviceguide.org/" target="_blank">
            {t("help.housingHelp.immediate.sfSFSG")}
          </a>
          {t("help.housingHelp.immediate.sfSFSGinfo")}
        </DoorwayCollapsibleSection>
        <DoorwayCollapsibleSection title={t("counties.fullname.SanMateo")}>
          <a
            href="https://www.smcgov.org/hsa/core-service-agencies-emergency-safety-net-assistance"
            target="_blank"
          >
            {t("help.housingHelp.immediate.sanmateoHS")}
          </a>
          {t("help.housingHelp.immediate.sanmateoHSinfo")}
        </DoorwayCollapsibleSection>
        <DoorwayCollapsibleSection title={t("counties.fullname.SantaClara")}>
          <a href="https://osh.sccgov.org/need-assistance" target="_blank">
            {t("help.housingHelp.immediate.santaclaraOSH")}
          </a>
          {t("help.housingHelp.immediate.santaclaraOSHinfo")}
          <br />
          <br />
          <a href="https://www.billwilsoncenter.org/services/all/here4you.html" target="_blank">
            {t("help.housingHelp.immediate.santaclaraHCC")}
          </a>
          {t("help.housingHelp.immediate.santaclaraHCCinfo")}
        </DoorwayCollapsibleSection>
        <DoorwayCollapsibleSection title={t("counties.fullname.Solano")}>
          <a href="http://www.housingfirstsolano.org/get-help.html" target="_blank">
            {t("help.housingHelp.immediate.solanoHFS")}
          </a>
          {t("help.housingHelp.immediate.solanoHFSinfo")}
        </DoorwayCollapsibleSection>
        <DoorwayCollapsibleSection title={t("counties.fullname.Sonoma")}>
          <a
            href="https://sonomacounty.ca.gov/development-services/community-development-commission/divisions/homeless-services/get-help"
            target="_blank"
          >
            {t("help.housingHelp.immediate.sonomaHS")}
          </a>
          {t("help.housingHelp.immediate.sonomaHSinfo")}
        </DoorwayCollapsibleSection>
      </Card.Section>
    </Card>,
    <Card
      className="border-0"
      key="housing-counseling"
      jumplinkData={{ title: t("help.housingHelp.counseling.title") }}
    >
      <Card.Header>
        <Heading priority={2} className={"text-primary-lighter font-bold"}>
          {t("help.housingHelp.counseling.title")}
        </Heading>
      </Card.Header>
      <Card.Section>{t("help.housingHelp.counseling.header")}</Card.Section>
      <Card.Section>
        <DoorwayCollapsibleSection title={t("help.housingHelp.counseling.HUDtitle")}>
          <a href="https://hudgov-answers.force.com/housingcounseling/" target="_blank">
            {t("help.housingHelp.counseling.HUD")}
          </a>
          {t("help.housingHelp.counseling.HUDinfo")}
        </DoorwayCollapsibleSection>
        <DoorwayCollapsibleSection title={t("counties.fullname.Alameda")}>
          <a href="http://edenir.org" target="_blank">
            {t("help.housingHelp.counseling.alamedaEden")}
          </a>
          {t("help.housingHelp.counseling.alamedaEdeninfo")}
        </DoorwayCollapsibleSection>
        <DoorwayCollapsibleSection title={t("counties.fullname.SanFrancisco")}>
          <a href="https://housing.sfgov.org/housing-counselors" target="_blank">
            {t("help.housingHelp.counseling.sfDAHLIA")}
          </a>
          {t("help.housingHelp.counseling.sfDAHLIAinfo")}
        </DoorwayCollapsibleSection>
        <DoorwayCollapsibleSection title={t("counties.fullname.SanMateo")}>
          <a href="https://www.housingchoices.org/" target="_blank">
            {t("help.housingHelp.counseling.sanMateoHC")}
          </a>
          {t("help.housingHelp.counseling.sanMateoHCinfo")}
          <br />
          <br />
          <a href="https://www.housing.org/tenants" target="_blank">
            {t("help.housingHelp.counseling.sanMateoPS")}
          </a>
          {t("help.housingHelp.counseling.sanMateoPSinfo")}
        </DoorwayCollapsibleSection>
        <DoorwayCollapsibleSection title={t("counties.fullname.SantaClara")}>
          <a href="https://www.housingchoices.org" target="_blank">
            {t("help.housingHelp.counseling.santaClaraHC")}
          </a>
          {t("help.housingHelp.counseling.santaClaraHCinfo")}
          <br />
          <br />
          <a href="https://www.housing.org/tenants" target="_blank">
            {t("help.housingHelp.counseling.santaClaraPS")}
          </a>
          {t("help.housingHelp.counseling.santaClaraPSinfo")}
        </DoorwayCollapsibleSection>
      </Card.Section>
    </Card>,
    <Card
      className="border-0"
      key="section-8-vouchers"
      jumplinkData={{ title: t("help.housingHelp.vouchers.title") }}
    >
      <Card.Header>
        <Heading priority={2} className={"text-primary-lighter font-bold"}>
          {t("help.housingHelp.vouchers.title")}
        </Heading>
      </Card.Header>
      <Card.Section>{t("help.housingHelp.vouchers.header")}</Card.Section>
      <Card.Section>
        <DoorwayCollapsibleSection title={t("counties.fullname.Alameda")}>
          <a href="http://www.haca.net/" target="_blank">
            {t("help.housingHelp.vouchers.alamedaHAcounty")}
          </a>
          <br />
          <br />
          <a href="http://www.alamedahsg.org/" target="_blank">
            {t("help.housingHelp.vouchers.alamedaHAcity")}
          </a>
          <br />
          <br />
          <a href="https://www.cityofberkeley.info/bha/" target="_blank">
            {t("help.housingHelp.vouchers.berkeleyHA")}
          </a>
          <br />
          <br />
          <a href="https://livermoreha.org/index.html" target="_blank">
            {t("help.housingHelp.vouchers.livermoreHA")}
          </a>
          <br />
          <br />
          <a href="http://www.oakha.org/Pages/default.aspx" target="_blank">
            {t("help.housingHelp.vouchers.oaklandHA")}
          </a>
          <br />
          <br />
          <a href="http://cityofpleasantonca.gov/" target="_blank">
            {t("help.housingHelp.vouchers.pleasantonHA")}
          </a>
          <br />
          <br />
          <a href="http://rhaca.org/" target="_blank">
            {t("help.housingHelp.vouchers.richmondHA")}
          </a>
        </DoorwayCollapsibleSection>
        <DoorwayCollapsibleSection title={t("counties.fullname.ContraCosta")}>
          <a href="http://pittsburgca.gov/" target="_blank">
            {t("help.housingHelp.vouchers.pittsburghHA")}
          </a>
        </DoorwayCollapsibleSection>
        <DoorwayCollapsibleSection title={t("counties.fullname.Marin")}>
          <a href="http://marinhousing.org/" target="_blank">
            {t("help.housingHelp.vouchers.marinHA")}
          </a>
        </DoorwayCollapsibleSection>
        <DoorwayCollapsibleSection title={t("counties.fullname.Napa")}>
          <a href="http://cityofnapa.org/" target="_blank">
            {t("help.housingHelp.vouchers.napaHA")}
          </a>
        </DoorwayCollapsibleSection>
        <DoorwayCollapsibleSection title={t("counties.fullname.SanFrancisco")}>
          <a href="http://sfha.org/" target="_blank">
            {t("help.housingHelp.vouchers.sfHA")}
          </a>
        </DoorwayCollapsibleSection>
        <DoorwayCollapsibleSection title={t("counties.fullname.SanMateo")}>
          <a
            href="https://www.smcgov.org/housing/apply-housing-authority-waiting-lists"
            target="_blank"
          >
            {t("help.housingHelp.vouchers.sanMateoHA")}
          </a>
          <br />
          <br />
          <a href="http://ssfha.org/" target="_blank">
            {t("help.housingHelp.vouchers.southSFHA")}
          </a>
        </DoorwayCollapsibleSection>
        <DoorwayCollapsibleSection title={t("counties.fullname.SantaClara")}>
          <a href="https://www.scchousingauthority.org/" target="_blank">
            {t("help.housingHelp.vouchers.santaClara")}
          </a>
        </DoorwayCollapsibleSection>
        <DoorwayCollapsibleSection title={t("counties.fullname.Solano")}>
          <a href="http://beniciahousingauthority.org/" target="_blank">
            {t("help.housingHelp.vouchers.beniciaHA")}
          </a>
          <br />
          <br />
          <a href="http://fairfield.ca.gov/" target="_blank">
            {t("help.housingHelp.vouchers.fairfieldHA")}
          </a>
          <br />
          <br />
          <a href="http://cityofvacaville.com/" target="_blank">
            {t("help.housingHelp.vouchers.vacavilleHA")}
          </a>
          <br />
          <br />
          <a href="http://cityofvallejo.net/" target="_blank">
            {t("help.housingHelp.vouchers.vallejoHA")}
          </a>
        </DoorwayCollapsibleSection>
        <DoorwayCollapsibleSection title={t("counties.fullname.Sonoma")}>
          <a href="http://sonoma-county.org/" target="_blank">
            {t("help.housingHelp.vouchers.sonomaHA")}
          </a>
          <br />
          <br />
          <a href="http://srcity.org/" target="_blank">
            {t("help.housingHelp.vouchers.santaRosaHA")}
          </a>
        </DoorwayCollapsibleSection>
      </Card.Section>
    </Card>,
    <Card
      className="border-0"
      key="housing-related-help"
      jumplinkData={{ title: t("help.housingHelp.relatedHelp.title") }}
    >
      <Card.Header>
        <Heading priority={2} className={"text-primary-lighter font-bold"}>
          {t("help.housingHelp.relatedHelp.title")}
        </Heading>
      </Card.Header>
      <Card.Section>
        {t("help.housingHelp.relatedHelp.header")}
        <a href="https://www.211bayarea.org/" target="_blank">
          {t("help.housingHelp.relatedHelp.headerLink")}
        </a>
        {t("help.housingHelp.relatedHelp.headerAfterLink")}
        <ul className="text__medium-normal list-disc ml-5">
          <li>{t("help.housingHelp.relatedHelp.header1")}</li>
          <li>{t("help.housingHelp.relatedHelp.header2")}</li>
          <li>{t("help.housingHelp.relatedHelp.header3")}</li>
        </ul>
      </Card.Section>
      <Card.Section>
        <DoorwayCollapsibleSection title={t("help.housingHelp.relatedHelp.211help")}>
          <ul className="text__medium-normal list-disc ml-5">
            <li>{t("help.housingHelp.relatedHelp.211help1")}</li>
            <li>{t("help.housingHelp.relatedHelp.211help2")}</li>
            <li>{t("help.housingHelp.relatedHelp.211help3")}</li>
            <li>{t("help.housingHelp.relatedHelp.211help4")}</li>
            <li>{t("help.housingHelp.relatedHelp.211help5")}</li>
            <li>{t("help.housingHelp.relatedHelp.211help6")}</li>
            <li>{t("help.housingHelp.relatedHelp.211help7")}</li>
            <li>{t("help.housingHelp.relatedHelp.211help8")}</li>
            <li>{t("help.housingHelp.relatedHelp.211help9")}</li>
            <li>{t("help.housingHelp.relatedHelp.211help10")}</li>
            <li>{t("help.housingHelp.relatedHelp.211help11")}</li>
            <li>{t("help.housingHelp.relatedHelp.211help12")}</li>
            <li>{t("help.housingHelp.relatedHelp.211help13")}</li>
            <li>{t("help.housingHelp.relatedHelp.211help14")}</li>
            <li>{t("help.housingHelp.relatedHelp.211help15")}</li>
            <li>{t("help.housingHelp.relatedHelp.211help16")}</li>
            <li>{t("help.housingHelp.relatedHelp.211help17")}</li>
            <li>{t("help.housingHelp.relatedHelp.211help18")}</li>
            <li>{t("help.housingHelp.relatedHelp.211help19")}</li>
            <li>{t("help.housingHelp.relatedHelp.211help20")}</li>
            <li>{t("help.housingHelp.relatedHelp.211help21")}</li>
            <li>{t("help.housingHelp.relatedHelp.211help22")}</li>
            <li>{t("help.housingHelp.relatedHelp.211help23")}</li>
          </ul>
        </DoorwayCollapsibleSection>
      </Card.Section>
    </Card>,
  ]
}
