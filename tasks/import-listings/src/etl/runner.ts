import { ExtractorInterface, TransformerInterface, LoaderInterface } from "./"
import { JurisdictionResolverInterface } from "./extract/jurisdiction-resolver-interface"
import { Logger } from "./logger"

export class Runner {
  jurisdictionResolver: JurisdictionResolverInterface
  extractor: ExtractorInterface
  transformer: TransformerInterface
  loader: LoaderInterface
  logger: Logger

  constructor(
    jurisdictionResolver: JurisdictionResolverInterface,
    extractor: ExtractorInterface,
    transformer: TransformerInterface,
    loader: LoaderInterface
  ) {
    this.jurisdictionResolver = jurisdictionResolver
    this.extractor = extractor
    this.transformer = transformer
    this.loader = loader
    this.logger = new Logger()
  }

  public enableOutputLogging(enable: boolean) {
    this.logger.printLogs = enable
    this.extractor.getLogger().printLogs = enable
    this.transformer.getLogger().printLogs = enable
    this.loader.getLogger().printLogs = enable
  }

  public init() {
    this.loader.open()
  }

  public async run() {
    const logger = this.logger

    try {
      logger.log("---- INITIALIZING RUNNER ----")
      this.init()

      logger.log("---- FETCHING JURISDICTIONS ----")
      const jurisdictions = await this.jurisdictionResolver.fetchJurisdictions()

      logger.log("---- FETCHING LISTINGS ----")
      const results = await this.extractor.extract(jurisdictions)

      logger.log("---- TRANSFORMING LISTINGS ----")
      const rows = this.transformer.mapAll(results)

      logger.log("---- LOADING NEW LISTINGS INTO DATABASE ----")

      // the await is required to keep shutdown from happening before load completes
      // we want shutdown to happen in the finally block rather than catching on each op
      /* eslint-disable @typescript-eslint/await-thenable */
      await this.loader.load(rows)
      logger.log("---- ETL RUN COMPLETE ----")
    } catch (e) {
      logger.error(e)
    } finally {
      logger.log("---- SHUTTING DOWN RUNNER ----")
      this.shutdown()
    }
  }

  public shutdown() {
    this.loader.close()
  }
}
