import { t } from "@bloom-housing/ui-components"
import ResourceCard from "../components/resources/ResourceCard"
import { ResourceCards } from "../components/resources/Resources"
import Markdown from "markdown-to-jsx"
import { Link } from "@bloom-housing/ui-seeds"

type ResourceLine = string | { text: string; href: string }

const renderLine = (line: ResourceLine) => {
  if (typeof line === "string") return line
  return (
    <Link href={line.href} className={"inline"}>
      {line.text}
    </Link>
  )
}

const cardContent = (resourceType: string, details: ResourceLine[]) => {
  return (
    <>
      <div className={"seeds-m-be-2 font-semibold"}>{resourceType}</div>
      {details.map((line, index) => (
        <div
          key={`${typeof line === "string" ? line : line.text}-${index}`}
          className={`${index < details.length - 1 ? "seeds-m-be-2" : ""}`}
        >
          {renderLine(line)}
        </div>
      ))}
    </>
  )
}

const resourceCard = (
  title: string,
  href: string | null,
  resourceType: string,
  details: ResourceLine[]
) => {
  return <ResourceCard title={title} href={href} content={cardContent(resourceType, details)} />
}

export const getJurisdictionResourcesContent = (): ResourceCards | null => {
  return {
    contactCard: {
      departmentTitle: t("resources.contactTitleCard"),
      description: <Markdown>{t("resources.contactDescription")}</Markdown>,
    },
    resourceSections: [
      {
        sectionTitle: t("resources.sectionTitle.servingTheHomeless"),
        cards: [
          resourceCard(
            "Ascencia",
            "https://www.ascenciaca.org",
            t("resources.resourceType.homelessServices"),
            [
              "1851 Tyburn St, Glendale CA 91204",
              { text: "(818) 246-7900", href: "tel:+18182467900" },
              "Nancy Ardon",
              { text: "nardon@ascenciaca.org", href: "mailto:nardon@ascenciaca.org" },
            ]
          ),
          resourceCard(
            "Downtown Womens' Center",
            "https://www.downtownwomenscenter.org",
            t("resources.resourceType.homelessServicesForWomen"),
            [
              "442 S San Pedro St, Los Angeles CA 90013",
              { text: "(213) 680-0600", href: "tel:+12136800600" },
              "Lorena Sanchez",
              {
                text: "LorenaS@DowntownWomensCenter.org",
                href: "mailto:LorenaS@DowntownWomensCenter.org",
              },
            ]
          ),
          resourceCard(
            "Goodwill Southern California",
            "https://www.goodwillsocal.org",
            t("resources.resourceType.otherServices"),
            [
              "342 San Fernando Rd, Los Angeles CA 90031",
              { text: "(323) 539-2000", href: "tel:+13235392000" },
              { text: "info@goodwillsocal.org", href: "mailto:info@goodwillsocal.org" },
            ]
          ),
          resourceCard(
            "Inner City Law Center",
            "https://www.innercitylaw.org",
            t("resources.resourceType.homelessServices"),
            [
              "1309 E 7th St, Los Angeles CA 90021",
              { text: "(213) 891-2880", href: "tel:+12138912880" },
              { text: "info@innercitylaw.org", href: "mailto:info@innercitylaw.org" },
            ]
          ),
          resourceCard(
            "Los Angeles Centers for Alcohol and Drug Abuse (L.A. CADA - DTLA)",
            "https://www.lacada.com",
            t("resources.resourceType.homelessServices"),
            [
              "470 E 3rd St, Los Angeles CA 90013",
              { text: "(213) 626-6411", href: "tel:+12136266411" },
              "Jennifer Ibarra",
              { text: "Jibarra@lacada.com", href: "mailto:Jibarra@lacada.com" },
            ]
          ),
          resourceCard(
            "Los Angeles Christian Health Centers",
            "https://www.lachc.com",
            t("resources.resourceType.otherServices"),
            [
              "1625 E 4th St, Los Angeles CA 90033",
              { text: "(213) 225-2666", href: "tel:+12132252666" },
              { text: "info@lachc.com", href: "mailto:info@lachc.com" },
            ]
          ),
          resourceCard(
            "Los Angeles Homeless Services Authority (LAHSA)",
            "https://www.lahsa.org",
            t("resources.resourceType.homelessServices"),
            [
              "811 Wilshire Blvd, Los Angeles CA 90017",
              { text: "(213) 683-3333", href: "tel:+12136833333" },
              { text: "cesmatching@lahsa.org", href: "mailto:cesmatching@lahsa.org" },
            ]
          ),
          resourceCard(
            "Midnight Mission",
            "https://www.midnightmission.org",
            t("resources.resourceType.homelessServices"),
            [
              "601 San Pedro St, Los Angeles CA 90014",
              { text: "(213) 624-9258", href: "tel:+12136249258" },
              "Carmen Pineda",
              { text: "cpineda@midnightmission.org", href: "mailto:cpineda@midnightmission.org" },
            ]
          ),
          resourceCard(
            "NoHo Home Alliance at St. Matthew's Church",
            "https://www.nohohome.org",
            t("resources.resourceType.homelessServices"),
            [
              "11031 Camarillo St, Los Angeles CA 91602",
              { text: "(818) 762-2909", href: "tel:+18187622909" },
              { text: "info@nohohome.org", href: "mailto:info@nohohome.org" },
            ]
          ),
          resourceCard(
            "PATH (People Assisting the Homeless)",
            "https://www.epath.org",
            t("resources.resourceType.homelessServices"),
            [
              "340 N Madison Ave, Los Angeles CA 90004",
              { text: "(323) 644-2200", href: "tel:+13236442200" },
              { text: "path@epath.org", href: "mailto:path@epath.org" },
            ]
          ),
          resourceCard(
            "St. Francis Center",
            "https://www.sfcla.org",
            t("resources.resourceType.homelessServices"),
            [
              "1835 S Hope St, Los Angeles CA 90015",
              { text: "(213) 747-5347", href: "tel:+12137475347" },
              { text: "info@sfcla.org", href: "mailto:info@sfcla.org" },
            ]
          ),
          resourceCard(
            "St. Vincent de Paul of Los Angeles",
            "https://www.svdpla.org",
            t("resources.resourceType.homelessServices"),
            [
              "210 N Avenue 21, Los Angeles CA 90031",
              { text: "(213) 229-9972", href: "tel:+12132299972" },
              "Tiffany Russell",
              { text: "socialservices@svdpla.org", href: "mailto:socialservices@svdpla.org" },
            ]
          ),
          resourceCard(
            "Step Up on Second",
            "https://www.stepup.org",
            t("resources.resourceType.homelessServices"),
            [
              "6762 Lexington Ave, Los Angeles CA 90038",
              { text: "(323) 380-7590", href: "tel:+13233807590" },
              "Tyler J. Martin",
              { text: "cpeoples@stepup.org", href: "mailto:cpeoples@stepup.org" },
            ]
          ),
          resourceCard(
            "The People Concern",
            "https://www.thepeopleconcern.org",
            t("resources.resourceType.homelessServices"),
            [
              "2116 Arlington Ave, Los Angeles CA 90018",
              { text: "(323) 334-9000", href: "tel:+13233349000" },
              {
                text: "customerservice@thepeopleconcern.org",
                href: "mailto:customerservice@thepeopleconcern.org",
              },
            ]
          ),
          resourceCard(
            "The Weingart Center",
            "https://www.weingart.org",
            t("resources.resourceType.homelessServices"),
            [
              "566 S San Pedro St, Los Angeles CA 90013",
              { text: "(213) 627-5302", href: "tel:+12136275302" },
              { text: "development@weingart.org", href: "mailto:development@weingart.org" },
            ]
          ),
          resourceCard(
            "Union Rescue Mission",
            "https://urm.org",
            t("resources.resourceType.homelessServices"),
            [
              "545 S San Pedro St, Los Angeles CA 90013",
              { text: "(213) 347-6300", href: "tel:+12133476300" },
              { text: "thewayhome@urm.org", href: "mailto:thewayhome@urm.org" },
            ]
          ),
        ],
      },
      {
        sectionTitle: t("resources.sectionTitle.servingDisabilities"),
        cards: [
          resourceCard(
            "APLA Health and Wellness",
            "https://aplahealth.org",
            t("resources.resourceType.otherServices"),
            [
              "611 S Kingsley Dr, Los Angeles CA 90005",
              { text: "(323) 329-9026", href: "tel:+13233299026" },
              "Jesse Castillo",
              { text: "jcastillo@aplahealth.org", href: "mailto:jcastillo@aplahealth.org" },
            ]
          ),
          resourceCard(
            "Being Alive",
            "https://www.beingalivela.org",
            t("resources.resourceType.developmentalDisabilities"),
            [
              "7080 Hollywood Blvd, Los Angeles CA 90028",
              { text: "(323) 874-4322", href: "tel:+13238744322" },
              "Jamie Baker",
              { text: "jamie@beingalivela.org", href: "mailto:jamie@beingalivela.org" },
            ]
          ),
          resourceCard(
            "Blind Children's Center",
            "https://www.blindchildrenscenter.org",
            t("resources.resourceType.supportServicesBlindVisual"),
            [
              "4120 Marathon St, Los Angeles CA 90029",
              { text: "(323) 664-2153", href: "tel:+13236642153" },
              "Liz Aguirre",
              {
                text: "mariabadalian@mosscompany.com",
                href: "mailto:mariabadalian@mosscompany.com",
              },
            ]
          ),
          resourceCard(
            "Braille Institute of America",
            "https://www.brailleinstitute.org",
            t("resources.resourceType.sensoryDisabilities"),
            [
              "741 N Vermont Ave, Los Angeles CA 90029",
              { text: "(323) 906-3193", href: "tel:+13239063193" },
              "Karine Rostomian",
              {
                text: "krostomian@brailleinstitute.org",
                href: "mailto:krostomian@brailleinstitute.org",
              },
            ]
          ),
          resourceCard(
            "CHIRP/LA Comprehensive Housing Information & Referrals for People Living with HIV/AIDS",
            "https://www.chirpla.org",
            t("resources.resourceType.housingLocationAssistance"),
            [
              "150 W 24th St, Los Angeles CA 90007",
              { text: "(213) 741-1951 EXT 202", href: "tel:+12137411951;ext=202" },
              "Adriana McCulloch",
              { text: "gfierro@chirpla.org", href: "mailto:gfierro@chirpla.org" },
            ]
          ),
          resourceCard(
            "Communities Actively Living Independent & Free",
            "https://www.calif-ilc.org",
            t("resources.resourceType.independentLiving"),
            [
              "634 S Spring St, Los Angeles CA 90014",
              { text: "(213) 627-0477", href: "tel:+12136270477" },
              "Michael Martinez",
              { text: "mtmartinez@calif-ilc.org", href: "mailto:mtmartinez@calif-ilc.org" },
            ]
          ),
          resourceCard(
            "Disability Community Resource Center",
            "https://www.dcrc.co",
            t("resources.resourceType.independentLiving"),
            [
              "12901 Venice Blvd, Los Angeles CA 90066",
              { text: "(310) 390-3611", href: "tel:+13103903611" },
              "Judith Da Vila",
              { text: "judith@dcrc.co", href: "mailto:judith@dcrc.co" },
            ]
          ),
          resourceCard(
            "Disability Rights California (DRC)",
            "https://www.disabilityrightsca.org",
            t("resources.resourceType.benefits"),
            [
              "350 S Bixel St, Los Angeles CA 90017",
              { text: "(213) 213-8000", href: "tel:+12132138000" },
              { text: "drc.losangeles@gmail.com", href: "mailto:drc.losangeles@gmail.com" },
            ]
          ),
          resourceCard(
            "Eastern Los Angeles Regional Center",
            "https://www.elarc.org",
            t("resources.resourceType.developmentalDisabilities"),
            [
              "1000 S Fremont Ave, Alhambra CA 91802",
              { text: "(626) 299-4700", href: "tel:+16262994700" },
              "Norma Duenas",
              { text: "Dweis@elarc.org", href: "mailto:Dweis@elarc.org" },
            ]
          ),
          resourceCard(
            "Epilepsy Foundation Los Angeles",
            null,
            t("resources.resourceType.otherServices"),
            [
              "5777 W Century Blvd, Los Angeles CA 90045",
              { text: "(800) 564-0445", href: "tel:+18005640445" },
              "Rebekkah Halliwell",
              { text: "help@endepilepsy.org", href: "mailto:help@endepilepsy.org" },
            ]
          ),
          resourceCard(
            "Fair Housing Council of San Fernando Valley",
            null,
            t("resources.resourceType.fairHousing"),
            [
              "14621 Titus St, Panorama City CA 91402",
              { text: "(818) 373-1185", href: "tel:+18183731185" },
              "Sandy Couch",
              {
                text: "scouch@fairhousingcouncil.org",
                href: "mailto:scouch@fairhousingcouncil.org",
              },
            ]
          ),
          resourceCard(
            "Fiesta Educativa",
            "https://www.fiestaeducativa.org",
            t("resources.resourceType.developmentalDisabilities"),
            [
              "2310 Pasadena Ave, Los Angeles CA 90031",
              { text: "(323) 221-6696", href: "tel:+13232216696" },
              "Cristina Gallo",
              { text: "info@fiestaeducativa.org", href: "mailto:info@fiestaeducativa.org" },
            ]
          ),
          resourceCard(
            "Frank D Lanterman Regional Center",
            "https://www.lanterman.org",
            t("resources.resourceType.developmentalDisabilities"),
            [
              "3303 Wilshire Blvd, Los Angeles CA 90010",
              { text: "(213) 383-1300", href: "tel:+12133831300" },
              "Koch Young",
              { text: "kyrc@lanterman.org", href: "mailto:kyrc@lanterman.org" },
            ]
          ),
          resourceCard(
            "Greater Los Angeles Agency on Deafness",
            "https://www.gladinc.org",
            t("resources.resourceType.deafHardOfHearing"),
            [
              "2222 Laverna Ave, Los Angeles CA 90041",
              { text: "(323) 478-8000", href: "tel:+13234788000" },
              "Rafif Gerrard",
              {
                text: "mariabadalian@mosscompany.com",
                href: "mailto:mariabadalian@mosscompany.com",
              },
            ]
          ),
          resourceCard(
            "HLAA-LA Chapter Hearing Loss Association of America",
            "https://hearingloss.org",
            t("resources.resourceType.hearingLossServices"),
            [
              "P.O. Box 56341, Los Angeles CA 90056",
              "Wendi Washington",
              { text: "dsviers@gmail.com", href: "mailto:dsviers@gmail.com" },
            ]
          ),
          resourceCard(
            "Independent Living Center of Southern California",
            "https://www.ilcsc.org",
            t("resources.resourceType.independentLiving"),
            [
              "14407 Gilmore St, Van Nuys CA 91401",
              { text: "(818) 785-6934", href: "tel:+18187856934" },
              "Esther Lopez",
              { text: "elopez@ilcsc.org", href: "mailto:elopez@ilcsc.org" },
            ]
          ),
          resourceCard(
            "Japanese Speaking Parent Association for Children with Challenges (c/o Little Tokyo Service Center)",
            "https://www.ltsc.org",
            t("resources.resourceType.supportGroupJapaneseParents"),
            [
              "231 E 3rd St, Los Angeles CA 90013",
              { text: "(818) 249-1726", href: "tel:+18182491726" },
              "Connie Yamada",
            ]
          ),
          resourceCard(
            "Jay Nolan Community Service",
            "https://www.jaynolan.org",
            t("resources.resourceType.developmentalDisabilities"),
            [
              "15501 San Fernando Mission Blvd, Mission Hills CA 91345",
              { text: "(818) 336-9548", href: "tel:+18183369548" },
              "Neerod Haddad",
              { text: "info@jaynolan.org", href: "mailto:info@jaynolan.org" },
            ]
          ),
          resourceCard(
            "Minority AIDS Project",
            "https://www.minorityaidsproject.org",
            t("resources.resourceType.aidsSupportGroup"),
            [
              "5149 W Jefferson Blvd, Los Angeles CA 90016",
              { text: "(323) 936-4949", href: "tel:+13239364949" },
              "Juan Soto",
              {
                text: "info@minorityaidsproject.org",
                href: "mailto:info@minorityaidsproject.org",
              },
            ]
          ),
          resourceCard(
            "North Los Angeles County Regional Center",
            "https://www.nlacrc.org",
            t("resources.resourceType.developmentalDisabilities"),
            [
              "9200 Oakdale Ave, Chatsworth CA 91311",
              { text: "(818) 778-1900", href: "tel:+18187781900" },
              { text: "webmaster@nlacrc.org", href: "mailto:webmaster@nlacrc.org" },
            ]
          ),
          resourceCard(
            "Pets Are Wonderful Support (PAWS)",
            "https://www.pawsla.org",
            t("resources.resourceType.assistanceAnimalsOpen"),
            [
              "150 W 24th St, Los Angeles CA 90007",
              { text: "(213) 741-1950 Ext 120", href: "tel:+12137411950;ext=120" },
              "Omar Olivares",
              { text: "swayland@pawsla.org", href: "mailto:swayland@pawsla.org" },
            ]
          ),
          resourceCard(
            "Project 180",
            "https://www.project180la.com",
            t("resources.resourceType.developmentalDisabilities"),
            [
              "470 E 3rd St, Los Angeles CA 90013",
              {
                text: "Phone : (213) 620-5712, Fax : (213) 621-4155",
                href: "tel:+12136205712",
              },
              "Gerardo Gonzalez",
              { text: "ggonzalez@project180la.com", href: "mailto:ggonzalez@project180la.com" },
            ]
          ),
          resourceCard(
            "San Fernando Valley Community Mental Health Center, Inc",
            "https://www.movinglivesforward.org/",
            t("resources.resourceType.otherServices"),
            [
              "16360 Roscoe Blvd, Los Angeles CA 91406",
              { text: "(818) 901-4836", href: "tel:+18189014836" },
              "Erica Pollack",
              { text: "cperkin@sfvcmhc.org", href: "mailto:cperkin@sfvcmhc.org" },
            ]
          ),
          resourceCard(
            "SHARE",
            "https://shareselfhelp.org",
            t("resources.resourceType.selfHelpSupportGroup"),
            [
              "425 S Broadway, Los Angeles CA 90013",
              { text: "(213) 213-0100 or (877) 742-7349", href: "tel:+12132130100" },
              "Bel Ng",
              { text: "info@shareselfhelp.org", href: "mailto:info@shareselfhelp.org" },
            ]
          ),
          resourceCard(
            "South Central Los Angeles Regional Center",
            "https://www.sclarc.org",
            t("resources.resourceType.developmentalDisabilities"),
            [
              "2500 S Western Ave, Los Angeles CA 90018",
              { text: "(213) 744-8420", href: "tel:+12137448420" },
              "Kiara Lopez",
              { text: "KiaraL@sclarc.org", href: "mailto:KiaraL@sclarc.org" },
            ]
          ),
          resourceCard(
            "SSG SILVER-Sustaining Independent Lives with Vital Empowering Resources",
            null,
            t("resources.resourceType.supportServiceOlderAdults"),
            [
              "515 Columbia Ave, Los Angeles CA 90017",
              { text: "(213) 553-1884 Ext 215", href: "tel:+12135531884;ext=215" },
              "Valorie Argomaniz",
              { text: "vargomaniz@ssgsilver.org", href: "mailto:vargomaniz@ssgsilver.org" },
            ]
          ),
          resourceCard(
            "The Black Aids Institute",
            "https://blackaids.org",
            t("resources.resourceType.hivAidsServicesForBlackPeople"),
            [
              "1833 W 8th St, Los Angeles CA 90057",
              { text: "(213) 353-3610", href: "tel:+12133533610" },
              "Raniyah Copeland",
              { text: "BrueS@BlackAIDS.org", href: "mailto:BrueS@BlackAIDS.org" },
            ]
          ),
          resourceCard(
            "The Institute for Applied Behavior Analysis",
            "https://www.iaba.com",
            t("resources.resourceType.developmentalDisabilities"),
            [
              "5601 W Slauson Ave, Culver City CA 90230",
              { text: "(310) 649-0499", href: "tel:+13106490499" },
              "Lorena De La Ossa",
            ]
          ),
          resourceCard(
            "The Life Group",
            "https://www.thelifegroupla.org",
            t("resources.resourceType.healingEducationalServicesAids"),
            [
              "1049 Havenshurst Dr, Los Angeles CA 90046",
              { text: "(888) 208-8081", href: "tel:+18882088081" },
              "Sunnie Rose",
              { text: "sunnie@thelifegroupla.org", href: "mailto:sunnie@thelifegroupla.org" },
            ]
          ),
          resourceCard(
            "Unification Of Disabled Latin Americans",
            null,
            t("resources.resourceType.otherServices"),
            [
              "540 S Normandie, Los Angeles CA 90020",
              { text: "(213) 388-8352", href: "tel:+12133888352" },
              "Ruben Hernandez",
              { text: "udla@sbcglobal.net", href: "mailto:udla@sbcglobal.net" },
            ]
          ),
        ],
      },
      {
        sectionTitle: t("resources.sectionTitle.seniorCenters"),
        cards: [
          resourceCard(
            "Alicia Broadus- Duncan Multipurpose Senior Center",
            null,
            t("resources.resourceType.seniorCenter"),
            [
              "11300 Glenoaks Blvd, Pacoima CA 91311",
              { text: "(818) 834-6100", href: "tel:+18188346100" },
              "Pat Austin",
            ]
          ),
          resourceCard(
            "Bernardi Multipurpose Senior Center",
            null,
            t("resources.resourceType.seniorCenter"),
            [
              "6514 Sylmar Ave, Van Nuys CA 91401",
              { text: "(747) 248-5966 or (818) 781-1101", href: "tel:+17472485966" },
              "Stephanie Galloway",
              { text: "sgalloway@vic-la.org", href: "mailto:sgalloway@vic-la.org" },
            ]
          ),
          resourceCard(
            "Bradley Multipurpose Senior Center",
            "https://seniorcenter.us/sc/bradley_multipurpose_senior_center_los_angeles_ca",
            t("resources.resourceType.seniorCenter"),
            [
              "10957 S Central Ave, Los Angeles CA 90059",
              { text: "(323) 749-5432 or (424) 236-3078", href: "tel:+13237495432" },
              "Phylis Willis",
              { text: "pwillis@wlcac.org", href: "mailto:pwillis@wlcac.org" },
            ]
          ),
          resourceCard(
            "Estelle-Van-Meter-Multipurpose-Center",
            null,
            t("resources.resourceType.seniorCenter"),
            [
              "7600 S Avalon Blvd, Los Angeles CA 90001",
              { text: "(323) 814-8085", href: "tel:+13238148085" },
              "Esther Velasco",
              { text: "evelasco@wlcac.org", href: "mailto:evelasco@wlcac.org" },
            ]
          ),
          resourceCard(
            "Felicia Mahood Multipurpose Senior Center (Jewish Family Service Center)",
            "https://recreation.parks.lacity.gov/multipurpose/felicia-mahood",
            t("resources.resourceType.seniorCenter"),
            [
              "11338 Santa Monica Blvd, Los Angeles CA 90025",
              { text: "(310) 937-5900", href: "tel:+13109375900" },
              "Lika Litt",
              { text: "llitt@jfsla.org", href: "mailto:llitt@jfsla.org" },
            ]
          ),
          resourceCard(
            "International Institute of Los Angeles",
            "https://www.iilosangeles.org",
            t("resources.resourceType.seniorCenter"),
            [
              "3845 Selig Pl, Los Angeles CA 90031",
              { text: "(323) 224-3800", href: "tel:+13232243800" },
            ]
          ),
          resourceCard(
            "James Wood Memorial Community Center (SRO)",
            "https://seniorcenter.us/sc/james_wood_memorial_community_center_single_room_occupancy_los_angeles_ca",
            t("resources.resourceType.seniorCenter"),
            [
              "400 E 5th St, Los Angeles CA 90013",
              { text: "(213) 229-9640", href: "tel:+12132299640" },
              { text: "age.webinfo@lacity.org", href: "mailto:age.webinfo@lacity.org" },
            ]
          ),
          resourceCard(
            "Jona Goldrich MPC",
            "https://www.jfsla.org/senior-and-multipurpose-centers/jona-goldrich-multipurpose-center/",
            t("resources.resourceType.seniorCenter"),
            [
              "330 N Fairfax Ave, Los Angeles CA 90036",
              { text: "(323) 937-5900", href: "tel:+13239375900" },
              "Lika Litt",
              { text: "llitt@jfsla.org", href: "mailto:llitt@jfsla.org" },
            ]
          ),
          resourceCard(
            "Mexican American Opportunity Foundation (MAOF)",
            "https://www.maof.org",
            t("resources.resourceType.seniorCenter"),
            [
              "401 N Garfield Ave, Montebello CA 90640",
              { text: "(323) 278-3896", href: "tel:+13232783896" },
              "Elizabeth Jimenez",
              { text: "ejimenez@maof.org", href: "mailto:ejimenez@maof.org" },
            ]
          ),
          resourceCard(
            "One Generation Senior Enrichment Center",
            "https://www.onegeneration.org",
            t("resources.resourceType.seniorCenter"),
            [
              "18255 Victory Blvd, Reseda CA 91335",
              { text: "(818) 705-2345", href: "tel:+18187052345" },
              "Niambi Cooper",
              { text: "ncooper@onegeneration.org", href: "mailto:ncooper@onegeneration.org" },
            ]
          ),
          resourceCard(
            "Robert M. Wilkinson Multipurpose Senior Center",
            null,
            t("resources.resourceType.seniorCenter"),
            [
              "8956 Vanalden Ave, Northridge CA 91324",
              { text: "(818) 705-2345", href: "tel:+18187052345" },
              "Natalie Pongo",
              {
                text: "Wilkinson.seniorcenter@lacity.org",
                href: "mailto:Wilkinson.seniorcenter@lacity.org",
              },
            ]
          ),
          resourceCard(
            "Sherman Oaks/East Valley Adult Center",
            "https://recreation.parks.lacity.gov/scc/sherman-oakseast-valley-adult",
            t("resources.resourceType.seniorCenter"),
            [
              "5056 Van Nuys Blvd, Sherman Oaks CA 91403",
              { text: "(818) 981-1284 Ext. 227", href: "tel:+18189811284;ext=227" },
              "Ileene Parker",
              {
                text: "shermanoakseastvalley.adultcenter@lacity.org",
                href: "mailto:shermanoakseastvalley.adultcenter@lacity.org",
              },
            ]
          ),
          resourceCard(
            "Single Room Occupancy (SRO) Corps.",
            null,
            t("resources.resourceType.seniorCenter"),
            [
              "1055 W 7th St, Los Angeles CA 90017",
              { text: "(213) 981-1284", href: "tel:+12139811284" },
              "Rosalind Harris",
              { text: "INFO@SROHOUSING.ORG", href: "mailto:INFO@SROHOUSING.ORG" },
            ]
          ),
          resourceCard(
            "Southeast Valley Multipurpose Senior Center",
            "https://aging.lacity.gov",
            t("resources.resourceType.seniorCenter"),
            [
              "5056 Van Nuys Blvd, Sherman Oaks CA 91403",
              { text: "(818) 386-9674", href: "tel:+18183869674" },
              "Kelci Verdugo",
              {
                text: "shermonoakseastvalley.adultcenter@lacity.org",
                href: "mailto:shermonoakseastvalley.adultcenter@lacity.org",
              },
            ]
          ),
          resourceCard("St. Barnabas - Echo Park", null, t("resources.resourceType.seniorCenter"), [
            "1021 N Alvarado St, Los Angeles CA 90026",
            { text: "(213) 388-4444", href: "tel:+12133884444" },
            "Lorenzo Hernandez",
            { text: "info@sbssla.org", href: "mailto:info@sbssla.org" },
          ]),
          resourceCard("St. Barnabas - Hollywood", null, t("resources.resourceType.seniorCenter"), [
            "5170 W Santa Monica Blvd, Los Angeles CA 90029",
            { text: "(213) 388-4445", href: "tel:+12133884445" },
            "Lorenzo Hernandez",
          ]),
          resourceCard(
            "St. Barnabas Multipurpose Senior Center",
            "https://www.sbssla.org",
            t("resources.resourceType.seniorCenter"),
            ["675 S Carondelet St, Los Angeles CA 90057"]
          ),
          resourceCard(
            "Theresa Lindsay Multipurpose Senior Center",
            null,
            t("resources.resourceType.seniorCenter"),
            [
              "429 E 42nd Pl, Los Angeles CA 90011",
              { text: "(323) 846-1920", href: "tel:+13238461920" },
              "Paul Magee",
              { text: "pmagee@wlcac.org", href: "mailto:pmagee@wlcac.org" },
            ]
          ),
          resourceCard(
            "West Adams Multipurpose Senior Center",
            "https://aging.lacity.gov/",
            t("resources.resourceType.seniorCenter"),
            [
              "2528 West Blvd, Los Angeles CA 90016",
              { text: "(323) 735-5799", href: "tel:+13237355799" },
              "Bridget Garcia",
              { text: "bgarcia@wlcac.org", href: "mailto:bgarcia@wlcac.org" },
            ]
          ),
          resourceCard(
            "Wilmington Jaycees Foundation Inc.",
            "https://wilmingtonjayceesfoundation.yolasite.com/",
            t("resources.resourceType.seniorCenter"),
            [
              "1371 Eubank Ave, Wilmington CA 90744",
              { text: "(310) 518-4533", href: "tel:+13105184533" },
              { text: "wjc-edpebp@att.net", href: "mailto:wjc-edpebp@att.net" },
            ]
          ),
        ],
      },
      {
        sectionTitle: t("resources.sectionTitle.familyAndYouthCenters"),
        cards: [
          resourceCard(
            "Best Buddies",
            "https://www.bestbuddies.org",
            t("resources.resourceType.volunteerServices"),
            [
              "11500 W Olympic Blvd, Los Angeles CA 90064",
              { text: "(323) 291-0118 Ext. 102", href: "tel:+13232910118;ext=102" },
              "Erica Mangham",
              {
                text: "california@bestbuddies.org",
                href: "mailto:california@bestbuddies.org",
              },
            ]
          ),
          resourceCard(
            "Bienestar-East Los Angeles",
            "https://www.bienestar.org",
            t("resources.resourceType.healthServicesLatinoLgbtq"),
            [
              "5326 E Beverly Blvd, Los Angeles CA 90022",
              { text: "(866) 590-6411 Ext. 204", href: "tel:+18665906411;ext=204" },
              { text: "info@bienestar.org", href: "mailto:info@bienestar.org" },
            ]
          ),
          resourceCard(
            "Black Child Development Institute Los Angeles South Bay Affiliate",
            "https://www.nbcdi.org",
            t("resources.resourceType.blackChildrenServices"),
            [
              "5153 Onacrest Dr, Los Angeles CA 90043",
              { text: "(323) 819-0848", href: "tel:+13238190848" },
              { text: "moreinfo@nbcdi.org", href: "mailto:moreinfo@nbcdi.org" },
            ]
          ),
          resourceCard(
            "Boyle Heights El Centro de Ayuda Corporation",
            "https://www.elcentrodeayuda.org",
            t("resources.resourceType.familySourceCenter"),
            [
              "2130 E 1st St, Los Angeles CA 90033",
              { text: "(323) 526-9301", href: "tel:+13235269301" },
              "Lori Calvillo",
              {
                text: "lori.calvillo@elcentrodeayuda.org",
                href: "mailto:lori.calvillo@elcentrodeayuda.org",
              },
            ]
          ),
          resourceCard(
            "Brotherhood Crusade Black United Fund",
            "https://www.brotherhoodcrusade.org",
            t("resources.resourceType.humanSocialServices"),
            [
              "401 Crenshaw Blvd, Los Angeles CA 90043",
              { text: "(323) 903-9626", href: "tel:+13239039626" },
              "Stacy Williams",
              { text: "info@brotherhoodcrusade.org", href: "mailto:info@brotherhoodcrusade.org" },
            ]
          ),
          resourceCard(
            "Central City Neighborhood Partners",
            "https://www.laccnp.org",
            t("resources.resourceType.familySourceCenter"),
            [
              "501 S Bixel St, Los Angeles CA 90017",
              { text: "(213) 482-8618", href: "tel:+12134828618" },
              { text: "info@laccnp.org", href: "mailto:info@laccnp.org" },
            ]
          ),
          resourceCard(
            "Chinatown Service Center",
            "https://www.cscla.org",
            t("resources.resourceType.communityHelpCenter"),
            [
              "767 N Hill St, Los Angeles CA 90012",
              { text: "(213) 808-1700 Ext. 1116", href: "tel:+12138081700;ext=1116" },
              "Amy Zhao",
              { text: "amzhao@cscla.org", href: "mailto:amzhao@cscla.org" },
            ]
          ),
          resourceCard(
            "East Los Angeles Womens' Center",
            "https://www.elawc.org",
            t("resources.resourceType.domesticViolenceSupport"),
            [
              "1431 S Atlantic Blvd, Los Angeles CA 90022",
              { text: "(800) 585-6231", href: "tel:+18005856231" },
              "Crisis Hotline",
            ]
          ),
          resourceCard(
            "Echo Park/Cypress- El Centro del Pueblo",
            "https://www.ecdpla.org",
            t("resources.resourceType.familySourceCenter"),
            [
              "1824 W Sunset Blvd, Los Angeles CA 90026",
              { text: "(213) 483-6335", href: "tel:+12134836335" },
              "Sabrina Ortega",
              { text: "sortega@ecdpla.org", href: "mailto:sortega@ecdpla.org" },
            ]
          ),
          resourceCard(
            "El Sereno/Lincoln Heights-Barrio Action Youth & Family Center",
            "https://www.barrioaction.org",
            t("resources.resourceType.familySourceCenter"),
            [
              "4927 N Huntington Dr, Los Angeles CA 90032",
              { text: "(323) 221-0779 Ext 331", href: "tel:+13232210779;ext=331" },
              "Amelia Ruiz",
              { text: "bsotomayor@barrioaction.org", href: "mailto:bsotomayor@barrioaction.org" },
            ]
          ),
          resourceCard(
            "Family Resource Library & Assistive Technology Center",
            "https://www.elafrc.org",
            t("resources.resourceType.familySourceCenter"),
            [
              "810 S Indiana St, Los Angeles CA 90023",
              { text: "(626) 300-9171", href: "tel:+16263009171" },
              "Martha Ornelas",
              { text: "info@elafrc.org", href: "mailto:info@elafrc.org" },
            ]
          ),
          resourceCard(
            "Korean Immigrant Workers Advocates of Southern California (KIWA)",
            "https://www.kiwa.org",
            t("resources.resourceType.seniorFamilyYouthCenter"),
            [
              "941 S Vermont Ave Ste 101, Los Angeles CA 90006",
              { text: "(213) 738-9050", href: "tel:+12137389050" },
              { text: "info@kiwa.org", href: "mailto:info@kiwa.org" },
            ]
          ),
          resourceCard(
            "Los Angeles Branch NAACP",
            "https://www.naacpla.org",
            t("resources.resourceType.youthServicesAfricanAmerican"),
            [
              "P.O. Box 56408, Los Angeles CA 90056",
              { text: "(213) 505-0818", href: "tel:+12135050818" },
              { text: "naacpla@sbcglobal.net", href: "mailto:naacpla@sbcglobal.net" },
            ]
          ),
          resourceCard(
            "National Association for Sickle Cell Disease, Inc.",
            "https://www.scdfc.org",
            t("resources.resourceType.supportServicesSickleCell"),
            [
              "3602 Inland Empire Blvd, Ontario CA 91764",
              { text: "(909) 743-5226", href: "tel:+19097435226" },
              { text: "info@scdfc.org", href: "mailto:info@scdfc.org" },
            ]
          ),
          resourceCard(
            "North Valley New Economics for Women",
            "https://neweconomicsforwomen.org/",
            t("resources.resourceType.familySourceCenter"),
            [
              "21400 Saticoy Blvd, Canoga Park CA 91304",
              { text: "(818) 887-3872", href: "tel:+18188873872" },
              { text: "info@neworg.us", href: "mailto:info@neworg.us" },
            ]
          ),
          resourceCard(
            "Pacoima Ei Nido Family Centers",
            "https://www.elnidofamilycenters.org",
            t("resources.resourceType.familySourceCenter"),
            [
              "11243 Glenoaks Blvd, Pacoima CA 91331",
              { text: "(818) 839-3646", href: "tel:+18188393646" },
              "Rosa Aldaco",
              {
                text: "vruiz@elnidofamilycenters.org",
                href: "mailto:vruiz@elnidofamilycenters.org",
              },
            ]
          ),
          resourceCard(
            "Peace Over Violence's Deaf, Disabled & Elder (DDE)",
            "https://www.peaceoverviolence.org",
            t("resources.resourceType.supportForDomesticViolence"),
            [
              "1541 Wilshire Blvd, Los Angeles CA 90017",
              { text: "(626) 584-6191", href: "tel:+16265846191" },
              { text: "info@peaceoverviolence.org", href: "mailto:info@peaceoverviolence.org" },
            ]
          ),
          resourceCard(
            "San Fernando Valley Community Mental Health Center, Inc",
            "https://www.movinglivesforward.org/",
            t("resources.resourceType.otherServices"),
            [
              "16360 Roscoe Blvd, Van Nuys CA 91406",
              { text: "(818) 901-4830", href: "tel:+18189014830" },
              { text: "info@sfvcmhc.org", href: "mailto:info@sfvcmhc.org" },
            ]
          ),
          resourceCard(
            "Southeast-All People’s Community Action CommunityCenter",
            "https://www.allpeoplescc.org",
            t("resources.resourceType.familySourceCenter"),
            [
              "822 E 20th St, Los Angeles CA 90011",
              { text: "(213) 747-6357", href: "tel:+12137476357" },
              { text: "allpeoples@allpeoplescc.org", href: "mailto:allpeoples@allpeoplescc.org" },
            ]
          ),
          resourceCard(
            "Southeast-El Nido Family Center",
            "https://www.elnidofamilycenters.org",
            t("resources.resourceType.familySourceCenter"),
            [
              "2069 W Slauson Ave, Los Angeles CA 90047",
              { text: "(323) 998-0093", href: "tel:+13239980093" },
            ]
          ),
          resourceCard(
            "Southwest / Florence The Children's Collective",
            "https://www.childrenscollective.org/",
            t("resources.resourceType.familySourceCenter"),
            [
              "915 W Manchester Ave, Los Angeles CA 90044",
              { text: "(323) 789-4717", href: "tel:+13237894717" },
            ]
          ),
          resourceCard(
            "SOVA Food Pantry and Resource Center",
            "https://www.jfsla.org/program/sova/",
            t("resources.resourceType.freeGroceriesForFamilies"),
            [
              "8846 W Pico Blvd, Los Angeles CA 90035",
              { text: "(877) 275-4537", href: "tel:+18772754537" },
              { text: "communications@jfsla.org", href: "mailto:communications@jfsla.org" },
            ]
          ),
          resourceCard(
            "Van Nuys New Economics for Women",
            "https://neweconomicsforwomen.org/",
            t("resources.resourceType.familySourceCenter"),
            [
              "6946 Van Nuys Blvd, Van Nuys CA 91405",
              { text: "(818) 786-4098", href: "tel:+18187864098" },
              { text: "ymedina@neworg.us", href: "mailto:ymedina@neworg.us" },
            ]
          ),
          resourceCard(
            "Watts Labor Community Action Committee",
            "https://www.wlcac.org",
            t("resources.resourceType.familySourceCenter"),
            [
              "958 E 108th St, Los Angeles CA 90059",
              { text: "(323) 563-4721", href: "tel:+13235634721" },
              { text: "crodriguez@wlcac.org", href: "mailto:crodriguez@wlcac.org" },
            ]
          ),
          resourceCard(
            "West Adams-1736 Family Crisis Center",
            "https://www.1736familycrisiscenter.org",
            t("resources.resourceType.familySourceCenter"),
            [
              "2116 Arlington Ave, Los Angeles CA 90018",
              { text: "(877) 574-9900 Ext. 225", href: "tel:+18775749900;ext=225" },
              "Rosanna Piccini",
            ]
          ),
          resourceCard(
            "West Los Angeles Latino Resource Organization, Inc",
            "https://www.latinoresource.org",
            t("resources.resourceType.familySourceCenter"),
            [
              "1645 Corinth Ave, Los Angeles CA 90025",
              { text: "(424) 293-8297", href: "tel:+14242938297" },
              { text: "info@latinoresource.org", href: "mailto:info@latinoresource.org" },
            ]
          ),
          resourceCard(
            "Wilshire-Bresee Foundation",
            "https://www.bresee.org",
            t("resources.resourceType.familySourceCenter"),
            [
              "184 S Bimini Pl, Los Angeles CA 90004",
              { text: "(213) 387-2822", href: "tel:+12133872822" },
              "Wendy Lopez",
            ]
          ),
          resourceCard(
            "Wilmington/San Pedro Toberman Neighborhood Center",
            "https://www.toberman.org",
            t("resources.resourceType.familySourceCenter"),
            [
              "131 N Grand Ave, San Pedro CA 90731",
              { text: "(310) 832-1145", href: "tel:+13108321145" },
              "Hector Jimenez",
            ]
          ),
        ],
      },
    ],
  }
}
