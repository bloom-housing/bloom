import { INestApplicationContext } from "@nestjs/common"
import { JurisdictionCreateDto } from "../../jurisdictions/dto/jurisdiction-create.dto"
import { Language } from "../../shared/types/language-enum"
import { JurisdictionsService } from "../../jurisdictions/services/jurisdictions.service"

export const activeJurisdictions: JurisdictionCreateDto[] = [
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
    enableAccessibilityFeatures: false,
    enableUtilitiesIncluded: true,
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
    enablePartnerSettings: null,
    enableAccessibilityFeatures: false,
    enableUtilitiesIncluded: true,
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
    enableAccessibilityFeatures: false,
    enableUtilitiesIncluded: false,
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
    enableAccessibilityFeatures: false,
    enableUtilitiesIncluded: false,
  },
]

export async function createJurisdictions(app: INestApplicationContext) {
  const jurisdictionService = await app.resolve<JurisdictionsService>(JurisdictionsService)
  // some jurisdictions are added via previous migrations
  const baseJurisdictions = await jurisdictionService.list()
  const toUpdate = []
  const toInsert = []
  const unchanged = []

  //classify which jurisdictions need to be added, updated or mantained
  activeJurisdictions.forEach((activeJuris) => {
    const existingJuris = baseJurisdictions.find((item) => item.name === activeJuris.name)
    if (!existingJuris) {
      toInsert.push(activeJuris)
    } else {
      const activeKeys = Object.keys(activeJuris)
      let updateNeeded = false
      let keyIdx = 0
      // comparison on each jurisdiction field to determine if update is required
      while (!updateNeeded && keyIdx < activeKeys.length) {
        const currKey = activeKeys[keyIdx]
        if (activeJuris[currKey] !== existingJuris[currKey]) {
          updateNeeded = true
        }
        keyIdx++
      }
      updateNeeded ? toUpdate.push(existingJuris) : unchanged.push(existingJuris)
    }
  })

  //updating existing jurisdictions
  const updated = await Promise.all(
    toUpdate.map(async (jurisdiction) => {
      const activeJuris = activeJurisdictions.find((def) => jurisdiction.name === def.name)
      const jurisdictionUpdated = {
        ...jurisdiction,
        ...activeJuris,
      }
      return await jurisdictionService.update(jurisdictionUpdated)
    })
  )

  // inserting new jurisdictions
  const inserted = await Promise.all(
    toInsert.map(async (jurisdiction) => {
      return await jurisdictionService.create(jurisdiction)
    })
  )

  const completeJurisdictions = [...unchanged, ...updated, ...inserted]

  return completeJurisdictions.sort((a, b) => (a.name < b.name ? -1 : 1))
}
