import * as fs from "fs"
import * as path from "path"
import CsvReadableStream from "csv-reader"
import { Connection, QueryRunner } from "typeorm"
import dbOptions from "../ormconfig"

// uses data from https://docs.google.com/spreadsheets/d/15KIX_wSuKmrtjYYrgRgb-LN1cdxIIJ9RSffPJ7SQ7j4/edit#gid=259554428
// from backend/core run with ts-node ./scripts/import-regions.ts [path to file]

/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const getStream = require("get-stream")

const args = process.argv.slice(2)

const filePath = args[0]
if (typeof filePath !== "string" && !fs.existsSync(filePath)) {
  throw new Error(`usage: ts-node import-unit-groups.ts csv-file-path`)
}

async function main() {
  const connection = new Connection(dbOptions)
  await connection.connect()
  const queryRunner: QueryRunner = connection.createQueryRunner()
  await queryRunner.connect()

  const inputRows = await getStream.array(
    fs.createReadStream(path.resolve("", filePath), "utf8").pipe(
      new CsvReadableStream({
        parseNumbers: true,
        parseBooleans: true,
        trim: true,
        asObject: true,
      })
    )
  )

  const regions = ["Greater Downtown", "Eastside", "Southwest", "Westside"]

  for (const row of inputRows) {
    try {
      if (
        row.neighborhood_new === "#N/A" ||
        row.neighborhood_new === "" ||
        regions.includes(row.region_new) === false
      )
        continue

      const listing = await queryRunner.query(`SELECT property_id FROM listings WHERE id = $1`, [
        row.id,
      ])
      await queryRunner.query(`UPDATE property SET neighborhood = $1, region = $2 WHERE id = $3`, [
        row.neighborhood_new,
        row.region_new,
        listing[0].property_id,
      ])
    } catch (e) {
      console.log({ e })
    }
  }
  await queryRunner.release()
}

void main()
