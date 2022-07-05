import * as fs from "fs"
import * as path from "path"
import CsvReadableStream from "csv-reader"
import { Connection, QueryRunner } from "typeorm"
import dbOptions from "../ormconfig"

// uses data from script-data/section-8-existing-info.csv
// from backend/core run with yarn ts-node ./scripts/import-section-8-info.ts [path to file]

/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const getStream = require("get-stream")

async function main() {
  const connection = new Connection(dbOptions)
  await connection.connect()
  const queryRunner: QueryRunner = connection.createQueryRunner()
  await queryRunner.connect()

  const inputRows = await getStream.array(
    fs
      .createReadStream(path.resolve("", "scripts/script-data/section-8-existing-info.csv"), "utf8")
      .pipe(
        new CsvReadableStream({
          parseNumbers: true,
          parseBooleans: true,
          trim: true,
          asObject: true,
        })
      )
  )
  const section8Rows = inputRows.reduce((acc, current) => {
    if (current.section_8 === "yes") acc += `'${current.id}',`
    return acc
  }, "")
  try {
    await queryRunner.query(
      //slice to remove trailing comma
      `UPDATE listings set section8_acceptance = true WHERE id in (${section8Rows.slice(0, -1)})`
    )
  } catch (e) {
    console.log({ e })
  }
  await queryRunner.release()
}

void main()
