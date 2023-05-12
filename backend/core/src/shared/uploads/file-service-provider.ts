import { Injectable } from "@nestjs/common"
import { FileService, FileServiceConfig } from "./types"

@Injectable()
export class FileServiceProvider {
  private _activeServiceName: string
  private _activeService: FileService
  private _registeredServices: Record<string, FileService>

  constructor(activeServiceName = "null") {
    this._registeredServices = {}
    this._activeServiceName = activeServiceName
  }

  configure(config: FileServiceConfig, varPrefix = "") {
    if (!this._registeredServices[this._activeServiceName]) {
      throw new Error(`Cannot configure unregistered file service "${this._activeServiceName}"`)
    }

    const activeConfig = {}
    // the prefix that valid config options will use
    const fullPrefix = `${varPrefix}${this._activeServiceName}_`

    // get all keys from the config
    Object.keys(config)
      // iterate through them to find matching vars for our active service
      .filter((key) => {
        if (key.startsWith(fullPrefix)) {
          return key
        }
      })
      // add those values to the activeConfig
      .forEach((key) => {
        // remove the prefix and convert to lowercase to normalize for constructor
        const shortKey = key.replace(fullPrefix, "").toLowerCase()
        // activeConfig[some_value] = config[FILE_SERVICE_null_SOME_VALUE]
        activeConfig[shortKey] = config[key]
      })

    // and initialize the service
    this._activeService = this._initService(this._activeServiceName, activeConfig)
    return this
  }

  private _initService(name: string, config: FileServiceConfig) {
    const service = this._registeredServices[name]

    if (!service) {
      throw new Error(`Cannot load unregistered file service [${this._activeServiceName}]`)
    }

    if (!service.isConfigured) {
      service.configure(config)
    }

    return service
  }

  get activeFileService() {
    return this._activeService
  }

  registerFileService(name: string, service: FileService) {
    this._registeredServices[name] = service
    return this
  }
}
