import { Injectable } from "@nestjs/common"
import { getConnection } from "typeorm"
import listingsSeeds from "../../../seeds.json"
import { Listing } from "../../entity/listing.entity"
import { Unit } from "../../entity/unit.entity"
import { Attachment } from "../../entity/attachment.entity"
import { Preference } from "../../entity/preference.entity"

@Injectable()
export class ListingsSeederService {
  async seed() {
    const skipped = ["id", "units", "attachments", "preferences"]
    const types = { units: Unit, attachments: Attachment, preferences: Preference }

    const connection = getConnection()
    const listings = listingsSeeds as any[]

    for await (const listing of listings) {
      const l = new Listing()
      const entities = {}
      for (const key in listing) {
        if (!skipped.includes(key)) {
          l[key] = listing[key]
        } else if (key !== "id") {
          entities[key] = listing[key]
        }
      }
      await connection.manager.save(l)

      for (const key in entities) {
        for (let value of entities[key]) {
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
  }
}
