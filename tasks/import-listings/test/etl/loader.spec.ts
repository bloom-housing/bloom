import { Knex } from "knex"
import { Loader } from "../../src/etl"

// these have to be defined in the top level due to namespace restrictions
const insertMethod = jest.fn()

// transactionProvider is callable and returns an object with an insert method
function mockTransaction() {
  return {
    insert: insertMethod,
  }
}

// it also has methods of its own
// hacky, but not sure of a better way to do this in the constraints of jest
/* eslint-disable @typescript-eslint/no-namespace */
namespace mockTransaction {
  export const raw = jest.fn()
  export const commit = jest.fn()
  export const rollback = jest.fn()
}

describe("Loader", () => {
  const tableName = "table_name"

  jest.mock("knex")

  const mockKnex = jest.fn().mockReturnValue({
    // transaction provider returns a function that returns a transaction
    transactionProvider: jest.fn().mockReturnValue(() => mockTransaction),
    destroy: jest.fn(),
  })(
    // required for TS to be aware of mock methods/props
    Knex as jest.Mocked<typeof Knex>
  )

  let loader: Loader

  beforeEach(() => {
    loader = new Loader(mockKnex, tableName)
    loader.getLogger().printLogs = false
    mockKnex.transactionProvider.mockClear()
    mockTransaction.raw.mockClear()
    mockTransaction.commit.mockClear()
    mockTransaction.rollback.mockClear()
    insertMethod.mockClear()
  })

  it("creates a transaction on open", () => {
    loader.open()
    expect(mockKnex.transactionProvider).toBeCalledTimes(1)
  })

  it("performs the correct operations on load", async () => {
    loader.open()

    const rows = [
      {
        foo: "bar",
      },
    ]

    await loader.load(rows)

    /*
      A note on the arg checks below

      For some reason, TS doesn't recognize `jestFn.mock` as a type of
      `MockFunctionState` and instead thinks it is a type of `MockContext`.
      This is incorrect, and causes it to think it doesn't have a `lastCall`
      property when it actually does.  `MockFunctionState` is not an exported
      type, so it isn't possible to cast to it.  The only solution I see
      is to cast to `any`, which isn't great but serves the intended function
      of silencing the IDE errors.
    */

    // make sure we truncate table first
    expect(mockTransaction.raw).toBeCalledTimes(1)
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const rawArg = (mockTransaction.raw.mock as any).lastCall[0]

    // should be a truncate table command
    expect(rawArg).toMatch(/TRUNCATE TABLE/)
    // with the table name passed in
    expect(rawArg).toEqual(expect.stringContaining(tableName))

    // call insert once with the rows provided
    expect(insertMethod).toBeCalledTimes(1)
    /* eslint-disable @typescript-eslint/no-explicit-any */
    expect((insertMethod.mock as any).lastCall[0]).toEqual(rows)

    // should be successful with commit call
    expect(mockTransaction.commit).toBeCalledTimes(1)
  })

  it("rolls back on error", async () => {
    // required to init transaction obj
    loader.open()

    const rows = [
      {
        foo: "bar",
      },
    ]

    // make the raw method fail
    mockTransaction.raw.mockImplementationOnce(() => {
      throw new Error("raw")
    })

    // there should be an exception
    await expect(loader.load(rows)).rejects.toThrow("raw")

    // loader should roll back changes
    expect(mockTransaction.rollback).toBeCalledTimes(1)
  })

  it("destroys everything on close", async () => {
    await loader.close()
    expect(mockKnex.destroy).toBeCalledTimes(1)
  })
})
