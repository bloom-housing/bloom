import { Injectable } from "@nestjs/common"
import { getConnection } from "typeorm"
import listingsSeeds from "../../../seeds.json"
import { Listing } from "../../entity/listing.entity"
import { Unit } from "../../entity/unit.entity"
import { Attachment } from "../../entity/attachment.entity"
import { Preference } from "../../entity/preference.entity"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ImportedJsonData = any

const subTypes = {
  units: Unit,
  attachments: Attachment,
  preferences: Preference,
}
export type RelationTypes = keyof typeof subTypes
type RelationEntities = {
  [k in RelationTypes]?: ImportedJsonData
}
// Extract the values of subTypes to build up a type map mapping the keys of subTypes to the instance types of the
// constructors. This basically just is translating subTypes from "value space" into "type space".
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ConstructorMap = Record<string, new (...args: any) => any>
type ValueForKey<K extends keyof T, T extends ConstructorMap> = InstanceType<T[K]>
type SubTypes = {
  [k in RelationTypes]: ValueForKey<k, typeof subTypes>
}

export function makeListing(rawListing: ImportedJsonData): [Listing, RelationEntities] {
  const l = new Listing()
  const relationEntities: RelationEntities = {}
  for (const key in rawListing) {
    if (key !== "id") {
      if (!Object.keys(subTypes).includes(key)) {
        l[key] = rawListing[key]
      } else {
        relationEntities[key] = rawListing[key]
      }
    }
  }
  return [l, relationEntities]
}

export function makeRelation<T extends RelationTypes>(
  type: T,
  listing: Listing,
  definition: ImportedJsonData
): SubTypes[T] | SubTypes[T][] {
  if (definition instanceof Array) {
    return definition.map((d) => makeRelation(type, listing, d) as SubTypes[T])
  } else {
    const entity = new subTypes[type]() as SubTypes[T]
    for (const key in definition) {
      if (key !== "id") {
        entity[key] = definition[key]
      }
    }
    entity.listing = listing
    return entity
  }
}

@Injectable()
export class ListingsSeederService {
  async seed() {
    const connection = getConnection()
    const listings = listingsSeeds as ImportedJsonData[]

    for await (const listingDefinition of listings) {
      const [listing, entities] = makeListing(listingDefinition)
      await connection.manager.save(listing)

      for (const key in entities) {
        const relations = makeRelation(key as RelationTypes, listing, entities[key])
        await connection
          .createQueryBuilder()
          .insert()
          .into(subTypes[key])
          .values(relations)
          .execute()
      }
    }
  }
}
