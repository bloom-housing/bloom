import { INestApplicationContext } from "@nestjs/common"
import { JurisdictionCreateDto } from "../../jurisdictions/dto/jurisdiction-create.dto"
import { Language } from "../../shared/types/language-enum"
import { JurisdictionsService } from "../../jurisdictions/services/jurisdictions.service"

export const defaultJurisdictions: JurisdictionCreateDto[] = [
  {
    name: "Alameda",
    preferences: [],
    languages: [Language.en],
    programs: [],
    publicUrl: "",
    emailFromAddress: "Alameda: Housing Bay Area",
    rentalAssistanceDefault:
      "Housing Choice Vouchers, Section 8 and other valid rental assistance programs will be considered for this property. In the case of a valid rental subsidy, the required minimum income will be based on the portion of the rent that the tenant pays after use of the subsidy.",
    enablePartnerSettings: true,
  },
  {
    name: "San Jose",
    preferences: [],
    languages: [Language.en],
    programs: [],
    publicUrl: "",
    emailFromAddress: "SJ: HousingBayArea.org",
    rentalAssistanceDefault:
      "Housing Choice Vouchers, Section 8 and other valid rental assistance programs will be considered for this property. In the case of a valid rental subsidy, the required minimum income will be based on the portion of the rent that the tenant pays after use of the subsidy.",
    enablePartnerSettings: true,
  },
  {
    name: "San Mateo",
    preferences: [],
    languages: [Language.en],
    programs: [],
    publicUrl: "",
    emailFromAddress: "SMC: HousingBayArea.org",
    rentalAssistanceDefault:
      "Housing Choice Vouchers, Section 8 and other valid rental assistance programs will be considered for this property. In the case of a valid rental subsidy, the required minimum income will be based on the portion of the rent that the tenant pays after use of the subsidy.",
    enablePartnerSettings: true,
  },
  {
    name: "Detroit",
    preferences: [],
    languages: [Language.en],
    programs: [],
    publicUrl: "",
    emailFromAddress: "Detroit Housing",
    rentalAssistanceDefault:
      "Housing Choice Vouchers, Section 8 and other valid rental assistance programs will be considered for this property. In the case of a valid rental subsidy, the required minimum income will be based on the portion of the rent that the tenant pays after use of the subsidy.",
    enablePartnerSettings: false,
  },
]

export async function createJurisdictions(app: INestApplicationContext) {
  const jurisdictionService = await app.resolve<JurisdictionsService>(JurisdictionsService)
  // some jurisdictions are added via previous migrations
  const jurisdictions = await jurisdictionService.list()
  const toInsert = defaultJurisdictions.filter(
    (rec) => jurisdictions.findIndex((item) => item.name === rec.name) === -1
  )
  const inserted = await Promise.all(
    toInsert.map(async (jurisdiction) => await jurisdictionService.create(jurisdiction))
  )
  // names are unique
  return jurisdictions.concat(inserted).sort((a, b) => (a.name < b.name ? -1 : 1))
}
