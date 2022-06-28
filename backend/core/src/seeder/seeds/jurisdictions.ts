import { INestApplicationContext } from "@nestjs/common"
import { JurisdictionCreateDto } from "../../jurisdictions/dto/jurisdiction-create.dto"
import { JurisdictionUpdateDto } from "../../jurisdictions/dto/jurisdiction-update.dto"
import { Language } from "../../shared/types/language-enum"
import { JurisdictionsService } from "../../jurisdictions/services/jurisdictions.service"

export const defaultJurisdictions: (JurisdictionCreateDto & JurisdictionUpdateDto)[] = [
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
  const initialJurisdictions = await jurisdictionService.list()
  const toUpdate = []
  const toInsert = []
  const unchanged = []
  const totalFieldUpdates = []

  //classify which jurisdictions need to be added, updated or mantained
  defaultJurisdictions.forEach((defaultJuris) => {
    const location = initialJurisdictions.findIndex((item) => item.name === defaultJuris.name)
    if (location === -1) {
      toInsert.push(defaultJuris)
    } else {
      const jurisdictionKeys = Object.keys(defaultJuris)
      let updateNeeded = false
      const fieldUpdates = []
      // comparison on each jurisdiction field to determine if update is required
      jurisdictionKeys.forEach((currKey) => {
        if (defaultJuris[currKey] !== initialJurisdictions[location][currKey]) {
          //store keys of updated fields
          fieldUpdates.push(currKey)
          updateNeeded = true
        }
      })
      if (updateNeeded) {
        toUpdate.push(initialJurisdictions[location])
        totalFieldUpdates.push(fieldUpdates)
      } else unchanged.push(initialJurisdictions[location])
    }
  })

  //updating existing jurisdictions
  const updated = await Promise.all(
    toUpdate.map(async (jurisdiction, idx) => {
      const location = defaultJurisdictions.findIndex((def) => jurisdiction.name === def.name)
      const updateObj = {}
      totalFieldUpdates[idx].forEach(
        // setting key value pairs based on default jurisdiction changes
        (fieldUpdate) => (updateObj[fieldUpdate] = defaultJurisdictions[location][fieldUpdate])
      )
      const jurisdictionUpdated = {
        ...jurisdiction,
        ...updateObj,
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
