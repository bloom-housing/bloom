import { jest } from "@jest/globals"
import {
  JurisdictionResolverInterface,
  ExtractorInterface,
  LoaderInterface,
  Runner,
  TransformerInterface,
} from "../../src/etl/"
import { Listing } from "../../src/types"
import { Logger } from "../../src/etl/logger"

describe("Runner", () => {
  const mockJurisdictionResolver: jest.Mocked<JurisdictionResolverInterface> = {
    setLogger: jest.fn(),
    getLogger: jest.fn(() => new Logger()),
    fetchJurisdictions: jest.fn(async () => {
      return Promise.resolve([])
    }),
  }

  const mockExtractor: jest.Mocked<ExtractorInterface> = {
    setLogger: jest.fn(),
    getLogger: jest.fn(() => new Logger()),
    // needed for method signature, but we don't do anything with it
    /* eslint-disable @typescript-eslint/no-unused-vars */
    extract: jest.fn(async (jurisdictions) => {
      return Promise.resolve([])
    }),
  }

  const mockTransformer: jest.Mocked<TransformerInterface> = {
    setLogger: jest.fn(),
    getLogger: jest.fn(() => new Logger()),
    mapAll: jest.fn(
      /* eslint-disable @typescript-eslint/no-unused-vars */
      (listings: Array<Listing>): Array<object> => {
        // listings is required by method signature but never used
        return []
      }
    ),
  }

  const mockLoader: jest.Mocked<LoaderInterface> = {
    setLogger: jest.fn(),
    getLogger: jest.fn(() => new Logger()),
    open: jest.fn(),
    load: jest.fn(),
    close: jest.fn(),
  }

  beforeEach(() => {
    mockJurisdictionResolver.fetchJurisdictions.mockClear()
    mockExtractor.extract.mockClear()
    mockTransformer.mapAll.mockClear()
    mockLoader.open.mockClear()
    mockLoader.load.mockClear()
    mockLoader.close.mockClear()
  })

  it("should shut down if failed", async () => {
    const runner = new Runner(mockJurisdictionResolver, mockExtractor, mockTransformer, mockLoader)
    runner.enableOutputLogging(false)

    const shutdownSpy = jest.spyOn(runner, "shutdown")

    mockExtractor.extract.mockImplementationOnce(() => {
      throw new Error("this is an expected error on the extractor")
    })

    // runner catches all errors and logs them
    await runner.run()

    // loader shouldn't be called if extractor throws an error
    expect(mockLoader.load.mock.calls.length).toBe(0)
    // but shutdown should
    expect(shutdownSpy.mock.calls.length).toBe(1)
  })

  it("should invoke all methods", async () => {
    const runner = new Runner(mockJurisdictionResolver, mockExtractor, mockTransformer, mockLoader)
    runner.enableOutputLogging(false)

    // spy on runner methods
    const initSpy = jest.spyOn(runner, "init")
    const shutdownSpy = jest.spyOn(runner, "shutdown")

    await runner.run()

    expect(initSpy.mock.calls.length).toBe(1)
    expect(shutdownSpy.mock.calls.length).toBe(1)
    expect(mockJurisdictionResolver.fetchJurisdictions.mock.calls.length).toBe(1)
    expect(mockExtractor.extract.mock.calls.length).toBe(1)
    expect(mockTransformer.mapAll.mock.calls.length).toBe(1)
    expect(mockLoader.open.mock.calls.length).toBe(1)
    expect(mockLoader.load.mock.calls.length).toBe(1)
    expect(mockLoader.close.mock.calls.length).toBe(1)
  })
})
