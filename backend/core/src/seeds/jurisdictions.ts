import { INestApplicationContext } from "@nestjs/common"
import { JurisdictionsService } from "../jurisdictions/services/jurisdictions.service"
import { JurisdictionCreateDto } from "../jurisdictions/dto/jurisdiction.dto"

export const defaultJurisdictions: JurisdictionCreateDto[] = [
  { name: "Alameda", programs: [] },
  { name: "San Jose", programs: [] },
  { name: "San Mateo", programs: [] },
  { name: "Detroit", programs: [] },
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
