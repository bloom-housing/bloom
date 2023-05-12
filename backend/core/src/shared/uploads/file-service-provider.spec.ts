import { FileServiceProvider } from "./file-service-provider"
import { FileService } from "./types"

describe("FileServiceProvider", () => {
  const mockService: jest.Mocked<FileService> = {
    isConfigured: false,
    config: {},
    configure: jest.fn(),
    putFile: jest.fn(),
    generateDownloadUrl: jest.fn(),
  }

  beforeEach(() => {
    mockService.configure.mockClear()
    mockService.putFile.mockClear()
    mockService.generateDownloadUrl.mockClear()
  })

  it("should filter the config correctly", () => {
    const serviceName = "mock"
    const prefix = "prefix_"

    const config = {
      ignore_me_null_some_value: "ignore", // ignore due to prefix
      prefix_notnull_some_value: "ignore", // ignore due to service name
      prefix_mock_UPPER: "valid",
      prefix_mock_lower: "valid",
    }

    new FileServiceProvider(serviceName)
      .registerFileService(serviceName, mockService)
      .configure(config, prefix)

    const compare = {
      upper: "valid",
      lower: "valid",
    }

    /* eslint-disable @typescript-eslint/unbound-method */
    expect(mockService.configure).toHaveBeenCalledTimes(1)
    /* eslint-disable @typescript-eslint/unbound-method */
    expect(mockService.configure).toHaveBeenCalledWith(compare)
  })

  it("should use the expected service", () => {
    const config = {}
    const serviceName = "mock"

    const provider = new FileServiceProvider(serviceName)
      .registerFileService(serviceName, mockService)
      .configure(config)

    expect(provider.activeFileService).toBe(mockService)
  })

  it("should throw if it can't find a matching service", () => {
    const provider = new FileServiceProvider("mock")

    expect(() => {
      provider.configure({})
    }).toThrow()
  })
})
