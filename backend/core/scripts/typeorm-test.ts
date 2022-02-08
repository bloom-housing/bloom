import { Connection } from "typeorm"

import dbOptions = require("../ormconfig")
import Listing from "../src/listings/entities/listing.entity"

async function main() {
  const conn = new Connection({
    ...dbOptions,
  })

  await conn.connect()
  const limit = 10
  const page = 2

  const qb = conn
    .createQueryBuilder(Listing, "listings")
    .leftJoinAndSelect("listings.property", "property")
    .leftJoinAndSelect("listings.leasingAgents", "leasingAgents")
    .leftJoinAndSelect("property.buildingAddress", "buildingAddress")
    .leftJoinAndSelect("property.units", "units")
    .leftJoinAndSelect("units.unitType", "unitTypeRef")
    .orderBy({
      "listings.applicationDueDate": "ASC",
      "listings.applicationOpenDate": "DESC",
      "listings.id": "ASC",
    })
    .take(limit)
    .skip((page - 1) * limit)
  const [result, count] = await qb.getManyAndCount()
  for (const l of result) {
    console.log(l.id)
  }
  console.log(count)
}

void main()
