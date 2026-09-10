import { t } from "@bloom-housing/ui-components"
import ResourceCard from "../components/resources/ResourceCard"
import { ResourceCards } from "../components/resources/Resources"

export const getJurisdictionResourcesContent = (): ResourceCards | null => {
  return {
    resourceSections: [
      {
        sectionTitle: t("resources.immediateHousingTitle"),
        sectionSubtitle: t("resources.immediateHousingAssistanceHeader"),
        cardsWithTitles: [
          {
            title: t("counties.fullname.Alameda"),
            cards: [
              <ResourceCard
                title={t("resources.immediate.alamedaBACS")}
                href="https://www.bayareacs.org/"
                content={t("resources.immediate.alamedaBACSinfo")}
              />,
              <ResourceCard
                title={t("resources.immediate.alamedaOD")}
                href="https://operationdignity.org/"
                content={t("resources.immediate.alamedaODinfo")}
              />,
            ],
          },
          {
            title: t("counties.fullname.ContraCosta"),
            cards: [
              <ResourceCard
                title={t("resources.immediate.contraCostaCHS")}
                href="https://www.cchealth.org/services-and-programs/homeless-services"
                content={t("resources.immediate.contraCostaCHSinfo")}
              />,
            ],
          },
          {
            title: t("counties.fullname.Marin"),
            cards: [
              <ResourceCard
                title={t("resources.immediate.marinMCRG")}
                href="https://www.marinhhs.org/resources/Housing"
                content={t("resources.immediate.marinMCRGinfo")}
              />,
            ],
          },
          {
            title: t("counties.fullname.Napa"),
            cards: [
              <ResourceCard
                title={t("resources.immediate.napaNCHS")}
                href="https://www.countyofnapa.org/272/Homeless-Services"
                content={t("resources.immediate.napaNCHSinfo")}
              />,
            ],
          },
          {
            title: t("counties.fullname.SanFrancisco"),
            cards: [
              <ResourceCard
                title={t("resources.immediate.sfSFSG")}
                href="https://sfserviceguide.org/"
                content={t("resources.immediate.sfSFSGinfo")}
              />,
            ],
          },
          {
            title: t("counties.fullname.SanMateo"),
            cards: [
              <ResourceCard
                title={t("resources.immediate.sanMateoHS")}
                href="https://www.smcgov.org/hsa/core-service-agencies-emergency-safety-net-assistance"
                content={t("resources.immediate.sanMateoHSinfo")}
              />,
            ],
          },
          {
            title: t("counties.fullname.SantaClara"),
            cards: [
              <ResourceCard
                title={t("resources.immediate.santaClaraOSH")}
                href="https://osh.sccgov.org/need-assistance"
                content={t("resources.immediate.santaClaraOSHinfo")}
              />,
              <ResourceCard
                title={t("resources.immediate.santaClaraHCC")}
                href="https://www.billwilsoncenter.org/services/all/here4you.html"
                content={t("resources.immediate.santaClaraHCCinfo")}
              />,
            ],
          },
          {
            title: t("counties.fullname.Solano"),
            cards: [
              <ResourceCard
                title={t("resources.immediate.solanoHFS")}
                href="https://www.housingfirstsolano.org/get-help-2/"
                content={t("resources.immediate.solanoHFSinfo")}
              />,
            ],
          },
          {
            title: t("counties.fullname.Sonoma"),
            cards: [
              <ResourceCard
                title={t("resources.immediate.sonomaHS")}
                href="https://sonomacounty.ca.gov/development-services/community-development-commission/divisions/homeless-services/get-help"
                content={t("resources.immediate.sonomaHSinfo")}
              />,
            ],
          },
        ],
      },
      {
        sectionTitle: t("resources.counseling.title"),
        sectionSubtitle: t("resources.counseling.header"),
        cardsWithTitles: [
          {
            title: t("resources.counseling.HUDtitle"),
            cards: [
              <ResourceCard
                title={t("resources.counseling.HUD")}
                href="https://www.hud.gov/stat/sfh/housing-counseling"
                content={t("resources.counseling.HUDinfo")}
              />,
            ],
          },
          {
            title: t("counties.fullname.Alameda"),
            cards: [
              <ResourceCard
                title={t("resources.counseling.alamedaEden")}
                href="https://211alamedacounty.org/"
                content={t("resources.counseling.alamedaEdeninfo")}
              />,
            ],
          },
          {
            title: t("counties.fullname.SanFrancisco"),
            cards: [
              <ResourceCard
                title={t("resources.counseling.sfDAHLIA")}
                href="https://housing.sfgov.org/housing-counselors"
                content={t("resources.counseling.sfDAHLIAinfo")}
              />,
            ],
          },
          {
            title: t("counties.fullname.SanMateo"),
            cards: [
              <ResourceCard
                title={t("resources.counseling.sanMateoHC")}
                href="https://www.housingchoices.org/"
                content={t("resources.counseling.sanMateoHCinfo")}
              />,
              <ResourceCard
                title={t("resources.counseling.sanMateoPS")}
                href="https://www.housing.org/"
                content={t("resources.counseling.sanMateoPSinfo")}
              />,
            ],
          },
          {
            title: t("counties.fullname.SantaClara"),
            cards: [
              <ResourceCard
                title={t("resources.counseling.santaClaraHC")}
                href="https://www.housingchoices.org/"
                content={t("resources.counseling.santaClaraHCinfo")}
              />,
              <ResourceCard
                title={t("resources.counseling.santaClaraPS")}
                href="https://www.housing.org/"
                content={t("resources.counseling.santaClaraPSinfo")}
              />,
            ],
          },
        ],
      },
      {
        sectionTitle: t("resources.vouchers.title"),
        sectionSubtitle: t("resources.vouchers.header"),
        cardsWithTitles: [
          {
            title: t("counties.fullname.Alameda"),
            cards: [
              <ResourceCard
                title={t("resources.vouchers.alamedaHAcounty")}
                href="https://www.haca.net/"
                content=""
              />,
              <ResourceCard
                title={t("resources.vouchers.alamedaHAcity")}
                href="https://www.alamedahsg.org/"
                content=""
              />,
              <ResourceCard
                title={t("resources.vouchers.berkeleyHA")}
                href="https://berkeleyhousingauthority.org/"
                content=""
              />,
              <ResourceCard
                title={t("resources.vouchers.livermoreHA")}
                href="https://www.livermoreha.org/"
                content=""
              />,
              <ResourceCard
                title={t("resources.vouchers.oaklandHA")}
                href="https://www.oakha.org/"
                content=""
              />,
              <ResourceCard
                title={t("resources.vouchers.pleasantonHA")}
                href="https://cityofpleasantonca.gov/"
                content=""
              />,
              <ResourceCard
                title={t("resources.vouchers.richmondHA")}
                href="https://rhaca.org/"
                content=""
              />,
            ],
          },
          {
            title: t("counties.fullname.ContraCosta"),
            cards: [
              <ResourceCard
                title={t("resources.vouchers.pittsburghHA")}
                href="https://pittsburgca.gov/"
                content=""
              />,
            ],
          },
          {
            title: t("counties.fullname.Marin"),
            cards: [
              <ResourceCard
                title={t("resources.vouchers.marinHA")}
                href="https://marinhousing.org/"
                content=""
              />,
            ],
          },
          {
            title: t("counties.fullname.Napa"),
            cards: [
              <ResourceCard
                title={t("resources.vouchers.napaHA")}
                href="https://cityofnapa.org/"
                content=""
              />,
            ],
          },
          {
            title: t("counties.fullname.SanFrancisco"),
            cards: [
              <ResourceCard
                title={t("resources.vouchers.sfHA")}
                href="https://sfha.org/"
                content=""
              />,
            ],
          },
          {
            title: t("counties.fullname.SanMateo"),
            cards: [
              <ResourceCard
                title={t("resources.vouchers.sanMateoHA")}
                href="https://www.smcgov.org/housing/apply-housing-authority-waiting-lists"
                content={t("resources.vouchers.sanMateoHA")}
              />,
              <ResourceCard
                title={t("resources.vouchers.southSFHA")}
                href="https://ssfha.org/"
                content=""
              />,
            ],
          },
          {
            title: t("counties.fullname.SantaClara"),
            cards: [
              <ResourceCard
                title={t("resources.vouchers.santaClara")}
                href="https://www.scchousingauthority.org/"
                content=""
              />,
            ],
          },
          {
            title: t("counties.fullname.Solano"),
            cards: [
              <ResourceCard
                title={t("resources.vouchers.beniciaHA")}
                href="https://beniciahousingauthority.org/"
                content=""
              />,
              <ResourceCard
                title={t("resources.vouchers.fairfieldHA")}
                href="https://fairfield.ca.gov/"
                content=""
              />,
              <ResourceCard
                title={t("resources.vouchers.vacavilleHA")}
                href="https://cityofvacaville.com/"
                content=""
              />,
              <ResourceCard
                title={t("resources.vouchers.vallejoHA")}
                href="https://cityofvallejo.net/"
                content=""
              />,
            ],
          },
          {
            title: t("counties.fullname.Sonoma"),
            cards: [
              <ResourceCard
                title={t("resources.vouchers.sonomaHA")}
                href="https://sonoma-county.org/"
                content=""
              />,
              <ResourceCard
                title={t("resources.vouchers.santaRosaHA")}
                href="https://srcity.org/"
                content=""
              />,
            ],
          },
        ],
      },
      {
        sectionTitle: t("resources.relatedHelp.title"),
        sectionSubtitle: t("resources.relatedHelp.header"),
        cards: [
          <ResourceCard
            title={t("resources.relatedHelp.211help")}
            href="https://www.211bayarea.org/"
            content={
              <>
                <ul>
                  <li>{t("resources.relatedHelp.211help1")}</li>
                  <li>{t("resources.relatedHelp.211help2")}</li>
                  <li>{t("resources.relatedHelp.211help3")}</li>
                  <li>{t("resources.relatedHelp.211help4")}</li>
                  <li>{t("resources.relatedHelp.211help5")}</li>
                  <li>{t("resources.relatedHelp.211help6")}</li>
                  <li>{t("resources.relatedHelp.211help7")}</li>
                  <li>{t("resources.relatedHelp.211help8")}</li>
                  <li>{t("resources.relatedHelp.211help9")}</li>
                  <li>{t("resources.relatedHelp.211help10")}</li>
                  <li>{t("resources.relatedHelp.211help11")}</li>
                  <li>{t("resources.relatedHelp.211help12")}</li>
                  <li>{t("resources.relatedHelp.211help13")}</li>
                  <li>{t("resources.relatedHelp.211help14")}</li>
                  <li>{t("resources.relatedHelp.211help15")}</li>
                  <li>{t("resources.relatedHelp.211help16")}</li>
                  <li>{t("resources.relatedHelp.211help17")}</li>
                  <li>{t("resources.relatedHelp.211help18")}</li>
                  <li>{t("resources.relatedHelp.211help19")}</li>
                  <li>{t("resources.relatedHelp.211help20")}</li>
                  <li>{t("resources.relatedHelp.211help21")}</li>
                  <li>{t("resources.relatedHelp.211help22")}</li>
                  <li>{t("resources.relatedHelp.211help23")}</li>
                </ul>
              </>
            }
          />,
        ],
      },
    ],
  }
}
