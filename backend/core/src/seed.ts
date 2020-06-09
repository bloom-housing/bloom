import "reflect-metadata"
import { createConnection } from "typeorm"
import { ListingEntity } from "./entity/listing.entity"
import { UnitEntity } from "./entity/unit.entity"
import { AttachmentEntity } from "./entity/attachment.entity"
import { PreferenceEntity } from "./entity/preference.entity"
import dbOptions = require("../ormconfig")
import listingsSeeds from "../seeds.json"

const skipped = ["id", "units", "attachments", "preferences"]
const types = { units: UnitEntity, attachments: AttachmentEntity, preferences: PreferenceEntity }

createConnection(dbOptions)
  .then(async (connection) => {
    const listings = listingsSeeds as any[]

    for await (const listing of listings) {
      const l = new ListingEntity()
      const entities = {}
      for await (const key of Object.keys(listing)) {
        if (!skipped.includes(key)) {
          l[key] = listing[key]
        } else if (key !== "id") {
          entities[key] = listing[key]
        }
      }
      await connection.manager.save(l)

      for await (const key of Object.keys(entities)) {
        for await (let value of entities[key]) {
          if (value) {
            if (value instanceof Array) {
              value = (value as any).map((obj) => {
                delete obj["id"]
                obj["listing"] = l.id
                return obj
              })
            } else {
              delete value["id"]
              value["listing"] = l.id
            }

            await connection.createQueryBuilder().insert().into(types[key]).values(value).execute()
          }
        }
      }
    }
  })
  .catch((error) => console.log("TypeORM connection error: ", error))
