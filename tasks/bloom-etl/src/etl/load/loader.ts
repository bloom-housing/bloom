import { Knex } from "knex"
import { LoaderInterface } from "./loader-interface"
import { BaseStage } from "../base-stage"

export class Loader extends BaseStage implements LoaderInterface {
  knex: Knex
  table: string
  txn: Knex.TransactionProvider

  constructor(knex: Knex, table: string) {
    super()
    this.knex = knex
    this.table = table
  }

  public open() {
    // set up the transaction
    this.log(`Loader: initializing transaction`)
    this.txn = this.knex.transactionProvider()
  }

  public async load(rows: Array<object>) {
    // don't do anything else if there are no rows to add
    if (rows.length < 1) return []

    // start the transaction
    const txn = await this.txn()

    try {
      // remove all existing records
      this.log(`Truncating records from table "${this.table}"`)
      await txn.raw(`TRUNCATE TABLE "${this.table}"`)

      // add new records
      this.log(`Adding ${rows.length} new rows into table`)
      await txn(this.table).insert(rows)

      // save changes
      this.log(`Committing database changes`)
      await txn.commit()
      this.log(`Load Results: import complete`)
    } catch (e) {
      this.log(`Rolling back changes`)
      await txn.rollback()
      throw e
    }
  }

  public async close() {
    try {
      this.log(`Loader: closing database connection`)
      await this.knex.destroy()
    } catch (e) {
      console.error(e)
    }
  }
}
